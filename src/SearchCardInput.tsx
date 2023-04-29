import { useEffect } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import * as React from 'react'
import { SearchCardResponse, useSearchCards } from './api'
import { useDebounce } from './utils'

type SearchCardInputProps = {
  selectedCard: SearchCardResponse['data'][number] | null
  setSelectedCard: React.Dispatch<React.SetStateAction<SearchCardResponse['data'][number] | null>>
}

const SearchCardInput = ({ selectedCard, setSelectedCard }: SearchCardInputProps) => {
  const [inputValue, setInputValue] = React.useState('')

  useEffect(() => {
    if (selectedCard) {
      setInputValue(selectedCard.name)
    } else {
      setInputValue('')
    }
  }, [selectedCard])

  const debouncedInputValue = useDebounce(inputValue, 100)

  const { data } = useSearchCards(debouncedInputValue)

  return (
    <Autocomplete
      sx={{ width: 300 }}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      filterOptions={(x) => x}
      options={data?.data || []}
      autoComplete
      includeInputInList
      filterSelectedOptions
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={selectedCard}
      onChange={(_event, newValue) => {
        setSelectedCard(newValue)
      }}
      noOptionsText="No card found"
      onInputChange={(_event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      renderInput={(params) => <TextField {...params} label="Search a card" fullWidth />}
      renderOption={(props, option) => {
        return <li {...props}>{option.name}</li>
      }}
    />
  )
}

export default SearchCardInput

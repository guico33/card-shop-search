import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useEffect } from 'react';
import { useSearchCards } from './api';
import useDebounce from './hooks/useDebounce';

type SearchCardInputProps = {
  selectedCard: string | null;
  setSelectedCard: React.Dispatch<React.SetStateAction<string | null>>;
};

const SearchCardInput = ({ selectedCard, setSelectedCard }: SearchCardInputProps) => {
  const [inputValue, setInputValue] = React.useState('');

  useEffect(() => {
    if (selectedCard) {
      setInputValue(selectedCard);
    } else {
      setInputValue('');
    }
  }, [selectedCard]);

  const debouncedInputValue = useDebounce(inputValue, 200);

  const { data } = useSearchCards(debouncedInputValue);

  return (
    <Autocomplete
      sx={{ width: 300 }}
      getOptionLabel={(option) => option}
      filterOptions={(x) => x}
      options={data || []}
      autoComplete
      includeInputInList
      filterSelectedOptions
      isOptionEqualToValue={(option, value) => option === value}
      value={selectedCard}
      onChange={(_event, newValue) => {
        setSelectedCard(newValue as string);
      }}
      noOptionsText={inputValue ? 'No card found' : ''}
      onInputChange={(_event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => <TextField {...params} label="Search a card" fullWidth />}
      renderOption={(props, option) => {
        return <li {...props}>{option}</li>;
      }}
    />
  );
};

export default SearchCardInput;

import { useEffect, useState } from 'react'
import { websiteToUrl, websites } from './constants'
import { Website } from './types'

export const generateLinks = (
  cardList: string,
): {
  cardName: string
  links: Record<Website, string>
}[] => {
  const cardListArray = cardList.split('\n')

  return cardListArray.map((card) => {
    // get what's after the first space
    let cardName = card.split(' ').slice(1).join(' ')
    // get what's before the first (character)
    cardName = cardName.split('(')[0].trim()
    return {
      cardName,
      links: Object.fromEntries(
        websites.map((website) => {
          let params: URLSearchParams = new URLSearchParams()
          if (website === 'Hareruya') {
            params = new URLSearchParams({
              suggest_type: 'all',
              product: cardName.split('//')[0].replaceAll(' ', '+'),
              stock: '1',
              order: 'ASC',
              sort: 'price',
            })
          } else if (website === 'TokyoMTG') {
            params = new URLSearchParams({
              p: 'a',
              query: cardName.replaceAll(' ', '+'),
              acm: '0',
              ass: '0',
              ast: '0',
              asx: '0',
              asa: '0',
            })
          } else if (website === 'Mox & Lotus') {
            params = new URLSearchParams({
              title: cardName.replaceAll(' ', '+'),
            })
          } else {
            params = new URLSearchParams({
              q: cardName.replaceAll(' ', '+'),
            })
          }

          const url = `${websiteToUrl[website]}?${params.toString().replaceAll('%2B', '+')}`

          return [website, url]
        }),
      ) as Record<Website, string>,
    }
  })
}

// https://usehooks.com/useDebounce/
export const useDebounce = <T>(value: T, delay: number) => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay], // Only re-call effect if value or delay changes
  )
  return debouncedValue
}

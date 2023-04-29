import axios from 'axios'
import { useQuery } from 'react-query'

// create new axios instance with base url https://api.scryfall.com
const scryfallApi = axios.create({
  baseURL: 'https://api.scryfall.com',
})

export type SearchCardResponse = {
  object: string
  total_cards: number
  has_more: boolean
  next_page: string
  data: {
    id: string
    name: string
    uri: string
    scryfall_uri: string

    image_uris: {
      small: string
      normal: string
      large: string
      png: string
      art_crop: string
      border_crop: string
    }

    mana_cost: string
    cmc: number
    type_line: string
    oracle_text: string
    power: string
    toughness: string
    colors: string[]
    color_identity: string[]
    legalities: {
      standard: string
      future: string
      historic: string
      pioneer: string
      modern: string
      legacy: string
      pauper: string
      vintage: string
      penny: string
      commander: string
      brawl: string
      duel: string
      oldschool: string
    }

    set: string
    set_name: string
    set_type: string
    set_uri: string
    set_search_uri: string
    scryfall_set_uri: string
    rulings_uri: string
    prints_search_uri: string
    collector_number: string
    digital: boolean
    rarity: string
    flavor_text: string
    illustration_id: string
    artist: string
    frame: string
    full_art: boolean
    border_color: string
    story_spotlight: boolean
    edhrec_rank: number
    prices: {
      usd: string
      usd_foil: string
      eur: string
      eur_foil: string
      tix: string
    }
    related_uris: {
      gatherer: string
      tcgplayer_infinite_articles: string
      tcgplayer_infinite_decks: string
      edhrec: string
      mtgtop8: string
    }

    purchase_uris: {
      tcgplayer: string
      cardmarket: string
      cardhoarder: string
    }
  }[]
}

const searchCards = async (query: string) => {
  const response = await scryfallApi.get<SearchCardResponse>(`/cards/search?q=${query}`)
  return response.data
}

// useSearchCard hook using react-query, use lodash debounce to prevent too many api calls
export const useSearchCards = (query: string) => {
  return useQuery({
    queryKey: ['searchCards', query],
    queryFn: () => searchCards(query),
    enabled: !!query,
    keepPreviousData: true,
  })
}

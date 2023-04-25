import React, { useState } from 'react'
import './app.css'

const websites = [
  'Hareruya',
  'TokyoMTG',
  'OneMTG',
  'Flagship Games',
  'Hideout',
  'Mox & Lotus',
] as const

type Website = (typeof websites)[number]

const websiteToUrl: Record<Website, string> = {
  Hareruya: 'https://www.hareruyamtg.com/en/products/search',
  TokyoMTG: 'https://tokyomtg.com/cardpage.html',
  OneMTG: 'https://www.onemtg.com.sg/search',
  'Flagship Games': 'https://www.flagshipgames.sg/search',
  Hideout: 'https://www.hideout-online.com/search',
  'Mox & Lotus': 'https://moxandlotus.sg/products',
}

const generateLinks = (
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

function App() {
  const [cardListText, setCardListText] = useState('')
  const [links, setLinks] = useState<
    {
      cardName: string
      links: Record<Website, string>
    }[]
  >([])

  const handleChangeCardList = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const cardList = e.target.value
    setCardListText(cardList)
  }

  const handleOpenTabs = () => {
    const links = generateLinks(cardListText)
    setLinks(links)
  }

  return (
    <main>
      <div style={{ display: 'flex', gap: '3rem' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <label>Cards list</label>
          <button onClick={handleOpenTabs}>Generate links</button>
          <textarea style={{ width: '360px', height: '70vh' }} onChange={handleChangeCardList} />
        </div>
        <div>
          <label>Links</label>
          {/* Table to display the links */}
          <table>
            <thead>
              <tr>
                <th>Card Name</th>
                {websites.map((website) => {
                  return <th key={website}>{website}</th>
                })}
              </tr>
            </thead>
            <tbody>
              {links.map((link) => {
                return (
                  <tr key={link.cardName}>
                    <td>{link.cardName}</td>
                    {websites.map((website) => {
                      return (
                        <td key={website}>
                          <a href={link.links[website]} target="_blank" rel="noreferrer">
                            Open
                          </a>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

export default App

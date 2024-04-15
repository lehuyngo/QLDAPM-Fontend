import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import TagListItem from '../component/tagListBar/TagListItem'
import {
  COOKIES_ITEM,
  LOCAL_STORAGE_ITEM,
  TAGS_RANDOM_COLOR
} from '../constants/common'
import { ITag } from '../interfaces/ITag'
import { IDraftMeetingNote } from '../interfaces/IMeetingNote'

const getColorForValue = (val: string | number) => {
  const colorMap: { [key: string]: string } = {
    1: '#DB4453',
    2: '#F6BB42',
    3: '#36BC9B',
    4: '#D96FAD',
    5: '#967BDC'
  }

  return colorMap[val]
}

const TagWrapper = ({
  tags,
  onClickDelete
}: {
  tags: ITag[]
  onClickDelete: (uuid: string) => void
}) => {
  const maxTagsToShow = 2
  return (
    <>
      {tags.slice(0, maxTagsToShow).map((tag: any, index: number) => {
        return (
          <TagListItem
            key={index}
            value={tag.name}
            backgroundColor={tag.color}
            onClickOpenDelete={() => onClickDelete(tag.uuid)}
          />
        )
      })}
    </>
  )
}

const getTextColor = (backgroundColor: string): string => {
  // Convert the hex color to RGB
  const hexToRgb = (hex: string): number[] => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (result) {
      return [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ]
    }

    return shorthandRegex.test(hex)
      ? [
          parseInt(hex.charAt(1), 16) * 17,
          parseInt(hex.charAt(2), 16) * 17,
          parseInt(hex.charAt(3), 16) * 17
        ]
      : [0, 0, 0]
  }

  // Calculate the relative luminance
  const calculateRelativeLuminance = (rgb: number[]): number => {
    const sRGB = rgb.map((val) => val / 255)
    const gammaCorrect = (val: number) =>
      val <= 0.04045 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
    const R = gammaCorrect(sRGB[0])
    const G = gammaCorrect(sRGB[1])
    const B = gammaCorrect(sRGB[2])
    return 0.2126 * R + 0.7152 * G + 0.0722 * B
  }

  // Determine text color based on luminance
  const textColor =
    calculateRelativeLuminance(hexToRgb(backgroundColor)) > 0.5
      ? 'black'
      : 'white'

  return textColor
}

const useGetScreenWidth = (): number => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setWindowWidth(window.innerWidth)
      }, 200)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return windowWidth
}

const useGetScreenHeight = (): number => {
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setWindowHeight(window.innerHeight)
      }, 200)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return windowHeight
}

const addUniqueColors = (strings: any) => {
  const usedColors = new Set()

  const getRandomColor = () => {
    const availableColors = TAGS_RANDOM_COLOR.filter(
      (color) => !usedColors.has(color)
    )
    if (availableColors.length === 0) {
      // All colors used, reset the set
      usedColors.clear()
    }
    const selectedColor =
      availableColors[Math.floor(Math.random() * availableColors.length)]
    usedColors.add(selectedColor)
    return selectedColor
  }

  return strings.map((str: any) => `${str}:${getRandomColor()}`)
}

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function findTextBetweenPrefixAndSuffix(
  inputString: string,
  prefix: string,
  suffix: string
) {
  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // replace special characters by add '\' before
  const escapedSuffix = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // replace special characters by add '\' before

  const regex = new RegExp(`${escapedPrefix}\\s*(.*?\\s*)${escapedSuffix}`, 'g')
  // \\s* : match any whitespace character
  // .*? : match any character (except for line terminators)

  let matches: string[] = []
  let match

  while ((match = regex.exec(inputString)) !== null) {
    // The captured group (match[1]) contains the text between prefix and suffix
    let matchStr = match[1].trim()
    if (!matchStr) continue // avoid empty string
    if (matches.includes(matchStr)) continue // avoid duplicate
    matches.push(matchStr)
  }

  return matches
}

function findTextWithPrefixAndSuffix(
  inputString: string,
  prefix: string,
  suffix: string
) {
  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // replace special characters by add '\' before
  const escapedSuffix = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // replace special characters by add '\' before

  const regex = new RegExp(`${escapedPrefix}\\s*(.*?\\s*)${escapedSuffix}`, 'g')
  // \\s* : match any whitespace character
  // .*? : match any character (except for line terminators)

  let matches: { fullText: string; text: string }[] = []
  let match

  while ((match = regex.exec(inputString)) !== null) {
    // The captured group (match[1]) contains the text between prefix and suffix
    matches.push({ fullText: match[0], text: match[1].trim() })
  }

  return matches
}

const customFilterOption = (inputValue: string, option: any) => {
  return String(option.children)
    .toLowerCase()
    .includes(inputValue.toLowerCase())
}

const focusMeetingNote = (meetingNoteID: string) => {
  let elm = document.getElementById(`meeting-note-${meetingNoteID}`)
  elm?.scrollIntoView()
  elm?.classList.add('focus-note')
  setTimeout(() => {
    elm?.classList.remove('focus-note')
  }, 1500)
}

function findTextRemovePrefixAndSuffix(
  inputString: string,
  prefix: string,
  suffix: string,
  textRemove: string
) {
  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // replace special characters by add '\' before
  const escapedSuffix = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // replace special characters by add '\' before

  const regex = new RegExp(`${escapedPrefix}\\s*(.*?\\s*)${escapedSuffix}`, 'g')
  // \\s* : match any whitespace character
  // .*? : match any character (except for line terminators)

  return inputString.replace(regex, (match, group) => {
    if (group.includes(textRemove)) {
      return group
    } else return match
  })
}

function endsWithWhitespace(str: string) {
  const whitespaceRegex = /\s$/
  return whitespaceRegex.test(str)
}

function startsWithWhitespace(str: string) {
  const whitespaceRegex = /^\s/
  return whitespaceRegex.test(str)
}

const clearSpaceString = (text: string): string =>
  text.replace(/\s+/g, ' ').trim()

function getNowTimeNearest() {
  const now = dayjs()
  const roundedMinutes = Math.ceil(now.minute() / 5) * 5
  const roundedTime = now.minute(roundedMinutes).second(0).millisecond(0)
  return roundedTime
}

function getNowTimeSaveDraftNote() {
  const now = dayjs()
  const nowDate = now.date()
  const roundedTime = now.date(nowDate + 7)
  return roundedTime
}

function getHTMLText([first, ...string]: any, ...values: any) {
  return values
    .reduce((acc: any, cur: any) => acc.concat(cur, string.shift()), [first])
    .filter((x: any) => (x && x !== true) || x === 0)
    .join('')
}

const removeDraftMeetingNote = (draftID: string) => {
  let creatingDraftList: IDraftMeetingNote[] = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_ITEM.DRAFT_MEETING_NOTE) || '[]'
  )
  creatingDraftList = creatingDraftList.filter((item) => item.id !== draftID)
  localStorage.setItem(
    LOCAL_STORAGE_ITEM.DRAFT_MEETING_NOTE,
    JSON.stringify(creatingDraftList)
  )
}

export {
  TagWrapper,
  addUniqueColors,
  capitalizeFirstLetter,
  clearSpaceString,
  customFilterOption,
  endsWithWhitespace,
  findTextBetweenPrefixAndSuffix,
  findTextRemovePrefixAndSuffix,
  focusMeetingNote,
  getColorForValue,
  getTextColor,
  startsWithWhitespace,
  useGetScreenHeight,
  useGetScreenWidth,
  findTextWithPrefixAndSuffix,
  getHTMLText,
  getNowTimeSaveDraftNote,
  getNowTimeNearest,
  removeDraftMeetingNote
}

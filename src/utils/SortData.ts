export const sortDataByActiveTime = (data: any) => {
  return data?.sort(
    (a: any, b: any) => (b.last_active_time || 0) - (a.last_active_time || 0)
  )
}

export const sortDataBySendTime = (data: any) => {
  return data?.sort((a: any, b: any) => (b.send_time || 0) - (a.send_time || 0))
}

export const sortDataByCreatedTime = (data: any) => {
  return data?.sort(
    (a: any, b: any) => (b.created_time || 0) - (a.created_time || 0)
  )
}

export const sortDataByCreatedAt = (data: any) => {
  return data?.sort(
    (a: any, b: any) => (b.created_at || 0) - (a.created_at || 0)
  )
}

export const sortDataByStartTime = (data: any) => {
  return data?.sort(
    (a: any, b: any) => (b.start_time || 0) - (a.start_time || 0)
  )
}

export const sortDataByReadTime = (data: any) => {
  return data?.sort((a: any, b: any) => (b.read_time || 0) - (a.read_time || 0))
}

export const sortDataByRangeTime = (
  data: any,
  range: { from: number; to: number }
) => {
  if (range.from === 0 || range.to === 0) return data
  return data?.filter(
    (item: any) =>
      item.created_time >= range.from && item.created_time <= range.to
  )
}

export const sortActivityThread = (data: any) => {
  data?.forEach((item: any) => {
    item.activities?.sort((a: any, b: any) => b.started_at - a.started_at)
  })

  data.sort(
    (a: any, b: any) =>
      b.activities?.[0]?.started_at - a.activities?.[0]?.started_at
  )

  return data
}

export const sortDataByNewestTime = (arr: any[]) => {
  return arr?.sort(
    (a: any, b: any) =>
      (b.last_active_time || b.created_time || 0) -
      (a.last_active_time || a.created_time || 0)
  )
}

// export const sortPointListTotal = (data) => {
//   const sortedData = data.sort((a, b) => {
//     if (b.point !== a.point) {
//       return b.point - a.point
//     }

//     return a.name.localeCompare(b.name)
//   })
//   return sortedData
// }

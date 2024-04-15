interface StatusDetails {
  1: { name: string; color: string }
  2: { name: string; color: string }
  3: { name: string; color: string }
  4: { name: string; color: string }
  5: { name: string; color: string }
}

export const getStatusDetails = (
  status: keyof StatusDetails
): StatusDetails[keyof StatusDetails] => {
  const statusDetails: StatusDetails = {
    1: { name: 'Prospect', color: '#F6BB42' }, //vừa tiếp xúc
    2: { name: 'Contacted', color: '#36BC9B' }, // đã meeting
    3: { name: 'Estimate', color: '#D96FAD' }, // báo giá
    4: { name: 'Follow up', color: '#4B89DC' }, //theo dõi sau báo giá
    5: { name: 'Project received', color: '#967BDC' } //nhận project
  }

  return statusDetails[status] || {}
}

import { Button, Divider, Tooltip } from 'antd'

interface Props {
  id: string
  name: string
}

const TooltipActionUser: React.FC<Props> = ({ name, id }) => {
  const ListAction = () => {
    return (
      <>
        <Button
          type='link'
          onClick={() => console.log('Profile', id)}
          style={{ padding: '2px 5px' }}
        >
          Profile
        </Button>
        <Divider type='vertical' style={{ background: 'white' }} />
        <Button
          type='link'
          onClick={() => console.log('Chat', id)}
          style={{ padding: '2px 5px' }}
        >
          Chat
        </Button>
        <Divider type='vertical' style={{ background: 'white' }} />
        <Button
          type='link'
          onClick={() => console.log('lead', id)}
          style={{ padding: '2px 5px' }}
        >
          Leads
        </Button>
      </>
    )
  }
  return (
    // <Tooltip title={<ListAction />}>
    <strong>{name}</strong>
    // </Tooltip>
  )
}
export default TooltipActionUser

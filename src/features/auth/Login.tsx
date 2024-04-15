// External dependencies
import { useMutation } from '@tanstack/react-query'
import { Button, Form, Input, message } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Internal dependencies
import { useLogin } from '../../api/reactQuery/auth'
import { COOKIES_ITEM, LOCAL_STORAGE_ITEM, PATH } from '../../constants/common'
import Timezone from '../../component/timezone/Timezone'

// StyleSheets
import VietnameseTetTheme from '../../theme/VietnameseTetTheme'
import { LoginFormStyle } from './style'
import { fetchDataGetMe } from '../../api/reactQuery/user'
import { checkTokenAndRedirect } from '../../utils/handleCookie'

// Assets

const Login = () => {
  // State logic
  const [loading, setLoading] = useState(false)

  // Ref

  // Variables

  // Custom hooks
  const { mutate } = useMutation({ mutationFn: useLogin })
  const navigate = useNavigate()

  // Higher-order functions

  // Component life-cycle methods (useEffect)
  const onFinish = (values: any) => {
    setLoading(true)
    const data = {
      username: values.username,
      password: values.password
    }

    mutate(data, {
      onSuccess: (data) => {
        if (data.token) {
          setLoading(false)
          localStorage.setItem(LOCAL_STORAGE_ITEM.TOKEN, data.token)

          fetchDataGetMe().then((res) => {
            if (res) {
              navigate(`${PATH.HOME}`)
            }
          })
          // document.cookie = `${COOKIES_ITEM.TOKEN}=${data.token}; domain=.tgl-cloud.com; path=/`
        }
        setLoading(false)
      },
      onError: (error: any) => {
        let msg = error?.response?.data?.message?.en
        console.error('Error login: ', msg)
        message.error(msg || 'Error login!')
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    if (checkTokenAndRedirect()) {
      navigate(PATH.HOME)
    }
  }, [])

  // Component render
  return (
    <VietnameseTetTheme className='page-login'>
      <LoginFormStyle
        name='normal_login'
        onFinish={onFinish}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <div className='title-form'>Login</div>
        <Form.Item
          className='field-form'
          name='username'
          label='Username'
          rules={[{ required: true, message: 'This field is required!' }]}
        >
          <Input placeholder='Fill username' />
        </Form.Item>
        <Form.Item
          name='password'
          label='Password'
          className='field-form'
          rules={[{ required: true, message: 'This field is required!' }]}
        >
          <Input.Password type='password' placeholder='Fill your password' />
        </Form.Item>
        <Form.Item className='footer-form-container'>
          <div className='footer-form'>
            <div className='btn-register-container'>
              Don't have an account?
              <div
                className='btn-register'
                onClick={() => navigate(`${PATH.REGISTER}`)}
              >
                Sign up
              </div>
            </div>
            <Button
              type='primary'
              htmlType='submit'
              className='btn-login'
              loading={loading}
            >
              Login
            </Button>

            <Timezone
              className='auth-btn-timezone'
              $theme={{
                name: 'theme-season',
                mainColor: '#b21a17',
                backgroundColor: '#fbeac7'
              }}
            />
          </div>
        </Form.Item>
      </LoginFormStyle>
    </VietnameseTetTheme>
  )
}

export { Login }

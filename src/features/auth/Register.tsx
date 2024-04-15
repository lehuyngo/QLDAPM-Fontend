import { Input, Button, Form, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import { useRegister } from '../../api/reactQuery/auth'
import { COOKIES_ITEM, LOCAL_STORAGE_ITEM, PATH } from '../../constants/common'

import { RegisterFormStyle } from './style'
import {
  maxLengthRule,
  validateEmail,
  validateUsername
} from '../../utils/validate'
import VietnameseTetTheme from '../../theme/VietnameseTetTheme'
import Timezone from '../../component/timezone/Timezone'

const Register = () => {
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { mutate } = useMutation({ mutationFn: useRegister })

  const onFinish = (values: any) => {
    setLoading(true)
    const data = {
      username: values.username,
      password: values.password,
      displayname: values.displayname,
      organization_name: values.organizationName,
      email: values.email
    }
    mutate(data, {
      onSuccess: (data) => {
        if (data.token) {
          message.success('Register successfully!')
          localStorage.setItem(LOCAL_STORAGE_ITEM.TOKEN, data.token)
          // document.cookie = `${COOKIES_ITEM.TOKEN}=${data.token}; domain=.tgl-cloud.com; path=/`
          setLoading(false)
          navigate(`${PATH.HOME}`)
        }
        setLoading(false)
      },
      onError: (error: any) => {
        let msg = error?.response?.data?.message?.en
        console.error('Error register: ', msg)
        message.error(msg || 'Error register!')
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    let token = localStorage.getItem(LOCAL_STORAGE_ITEM.TOKEN)
    if (token) {
      navigate(`${PATH.CLIENT}`)
    }
  }, [navigate])

  return (
    <VietnameseTetTheme className='page-register'>
      <RegisterFormStyle
        name='normal_register'
        onFinish={onFinish}
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 15 }}
      >
        <div className='title-form'>Signup</div>
        <div className='note-form'>(*) All fields are required!</div>
        <Form.Item
          name='displayname'
          className='field-form'
          label='Display name'
          rules={[
            { required: true, message: 'This field is required!' },
            maxLengthRule(100)
          ]}
        >
          <Input placeholder='Fill display name' />
        </Form.Item>
        <Form.Item
          name='organizationName'
          className='field-form'
          label='Organization name'
          rules={[
            { required: true, message: 'This field is required!' },
            maxLengthRule(100)
          ]}
        >
          <Input placeholder='Fill organization name' />
        </Form.Item>
        <Form.Item
          name='email'
          label='Email'
          className='field-form'
          rules={[
            {
              required: true,
              message: 'This field is required!'
            },
            validateEmail,
            maxLengthRule(100)
          ]}
        >
          <Input placeholder='Fill email' type='email' />
        </Form.Item>

        <Form.Item
          name='username'
          className='field-form'
          label='Username'
          rules={[
            { required: true, message: 'This field is required!' },
            validateUsername,
            maxLengthRule(20),
            {
              message: 'Required minimum of 4 characters!',
              min: 4
            }
          ]}
        >
          <Input placeholder='Fill username' />
        </Form.Item>
        <Form.Item
          name='password'
          label='Password'
          className='field-form'
          rules={[
            { required: true, message: 'This field is required!' },
            maxLengthRule(20),
            {
              message: 'Required minimum of 6 characters!',
              min: 6
            }
          ]}
        >
          <Input.Password type='password' placeholder='Fill password' />
        </Form.Item>

        <Form.Item label='a' className='field-form-footer'>
          <div className='footer-form'>
            <div className='btn-login-container'>
              Already have an account?
              <div
                className='btn-login'
                onClick={() => navigate(`${PATH.LOGIN}`)}
              >
                Login
              </div>
            </div>
            <Button
              type='primary'
              htmlType='submit'
              className='btn-register'
              loading={loading}
            >
              Sign up
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
      </RegisterFormStyle>
    </VietnameseTetTheme>
  )
}

export { Register }

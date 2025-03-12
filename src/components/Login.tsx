import { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Form, Input, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ShineBorder } from "@/components/ShineBorder";

type LoginProps = {
  onLoginSuccess: (token: string) => void;
  onClose: () => void;
}

const errorMap: Record<string, { field: string; message: string }> = {
  账号不能为空: {
    field: 'username',
    message: '账号不能为空',
  },
  账号不存在: {
    field: 'username',
    message: '账号不存在',
  },
  密码不能为空: {
    field: 'password',
    message: '密码不能为空',
  },
  密码错误: {
    field: 'password',
    message: '密码错误',
  },
  账号已存在: {
    field: 'username',
    message: '账号已存在',
  },
  '账号不合法，请使用其他账号': {
    field: 'username',
    message: '账号不合法，请使用其他账号',
  },
}
export default function Login({ onLoginSuccess, onClose }: LoginProps) {
  const [type, setType] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState({
    status: false,
    message: '',
  });
  const [passwordError, setPasswordError] = useState({
    status: false,
    message: '',
  });
  const [confirmPasswordError, setConfirmPasswordError] = useState({
    status: false,
    message: '',
  });
  const vaildUsername = (value: string) => {
    if (!value) {
      setUsernameError({
        status: true,
        message: '用户名不能为空',
      });
      return false;
    }
    if (value.length < 4) {
      setUsernameError({
        status: true,
        message: '用户名不能小于4个字符',
      });
      return false;
    }
    if (value.length > 16) {
      setUsernameError({
        status: true,
        message: '用户名不能大于16个字符',
      });
      return false;
    }
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      setUsernameError({
        status: true,
        message: '用户名只能包含数字和字母',
      });
      return false;
    }
    setUsernameError({
      status: false,
      message: '',
    });
    return true;
  }
  const vaildPassword = (value: string) => {
    if (!value) {
      setPasswordError({
        status: true,
        message: '密码不能为空',
      });
      return false;
    }
    if (value.length < 6) {
      setPasswordError({
        status: true,
        message: '密码不能小于6个字符',
      });
      return false;
    }
    if (value.length > 16) {
      setPasswordError({
        status: true,
        message: '密码不能大于16个字符',
      });
      return false;
    }
    // 密码可以是数字、字母和英文符号 (任意两种组成)
    if (!/^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{4,16}$/.test(value)) {
      setPasswordError({
        status: true,
        message: '密码必须包含数字、字母和英文符号任意两种',
      });
      return false;
    }
    setPasswordError({
      status: false,
      message: '',
    });
    return true;
  }
  const vaildConfirmPassword = (value: string, oldPassword?: string) => {
    console.log(value, oldPassword || password);
    
    if (!value) {
      return false;
    }
    if (value !== (oldPassword || password)) {
      setConfirmPasswordError({
        status: true,
        message: '两次密码不一致，请重新输入',
      });
      return false;
    }
    setConfirmPasswordError({
      status: false,
      message: '',
    });
    return true;
  }
  const onChangeCardType = (type: 'login' | 'register') => {
    setType(type);
    if (type === 'login') {
      setUsername('');
      setPassword('');
      setUsernameError({
        status: false,
        message: '',
      });
      setPasswordError({
        status: false,
        message: '',
      });
    } else {
      setUsername('');
      setUsernameError({
        status: false,
        message: '',
      });
      setPassword('');
      setPasswordError({
        status: false,
        message: '',
      });
      setConfirmPassword('');
      setConfirmPasswordError({
        status: false,
        message: '',
      });
    }
  }
  const onLogin = async () => {
    if (!vaildUsername(username)) {
      return;
    }
    if (!vaildPassword(password)) {
      return;
    }
    setIsLoading(true);
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }).then(res => res.json()).then(data => {
      console.log(data);
      if (!data.success) {
        if (errorMap[data.message]?.field === 'username') {
          setUsernameError({
            status: true,
            message: errorMap[data.message].message
          });
        } else if (errorMap[data.message]?.field === 'password') {
          setPasswordError({
            status: true,
            message: errorMap[data.message].message
          });
        } else {
          setUsernameError({
            status: true,
            message: `登录失败,${data.message}`,
          });
          setPasswordError({
            status: true,
            message: `登录失败,${data.message}`,
          });
        }
        return;
      }
      onLoginSuccess(data.data.token);
      onClose();
    }).finally(() => {
      setIsLoading(false);
    })
  }
  const onRegister = async () => {
    if (!vaildUsername(username)) {
      return;
    }
    if (!vaildPassword(password)) {
      return;
    }
    if (!vaildConfirmPassword(confirmPassword, password)) {
      return;
    }
    setIsLoading(true);
    fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }).then(res => res.json()).then(data => {
      console.log(data);
      if (!data.success) {
        if (errorMap[data.message]?.field === 'username') {
          setUsernameError({
            status: true,
            message: errorMap[data.message].message,
          });
        } else {
          setUsernameError({
            status: true,
            message: `注册失败,${data.message}`,
          });
        }
        return;
      }
      onLoginSuccess(data.data.token);
      onClose();
    }).finally(() => {
      setIsLoading(false);
    })
  }

  return (
    <Card className="relative p-2">
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} borderWidth={2} />
      <Button isIconOnly variant="light" onPress={onClose} className="absolute top-2 right-2 z-[999]">
        <Icon icon="solar:close-circle-broken" width={24} />
      </Button>
      <CardHeader className="flex flex-col gap-2">
        <p className="text-2xl font-bold">Login</p>
        <p className="text-sm text-gray-500">Enter your credentials to access your account</p>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        {
          type === 'login' && (
            <Form>
              <Input
                autoComplete="username"
                label="用户名"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  vaildUsername(e.target.value);
                }}
                color={usernameError.status ? 'danger' : 'success'}
                errorMessage={usernameError.message}
                isInvalid={usernameError.status}
              />
              <Input
                autoComplete="password"
                label="密码"
                type="password"
                name="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  vaildPassword(e.target.value);
                }}
                color={passwordError.status ? 'danger' : 'success'}
                errorMessage={passwordError.message}
                isInvalid={passwordError.status}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    onLogin();
                  }
                }}
              />
              <span className="text-sm text-gray-500">
                没有账号？<Button isIconOnly variant="light" onPress={() => onChangeCardType('register')} className="text-blue-500">注册</Button>
              </span>
            </Form>
          )
        }
        {
          type === 'register' && (
            <Form>
              <Input
                autoComplete="new-username"
                label="用户名"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  vaildUsername(e.target.value);
                }}
                color={usernameError.status ? 'danger' : 'success'}
                errorMessage={usernameError.message}
                isInvalid={usernameError.status}
              />
              <Input
                autoComplete="new-password"
                label="密码"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  vaildPassword(e.target.value);
                  vaildConfirmPassword(confirmPassword, e.target.value);
                }}
                color={passwordError.status ? 'danger' : 'success'}
                errorMessage={passwordError.message}
                isInvalid={passwordError.status}
              />
              <Input
                autoComplete="new-password"
                label="确认密码"
                type="password"
                placeholder="请输入密码"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  vaildConfirmPassword(e.target.value);
                }}
                color={confirmPasswordError.status ? 'danger' : 'success'}
                errorMessage={confirmPasswordError.message}
                isInvalid={confirmPasswordError.status}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    onRegister();
                  }
                }}
              />
              <span className="text-sm text-gray-500">
                已有账号？<Button isIconOnly variant="light" onPress={() => onChangeCardType('login')} className="text-blue-500">登录</Button>
              </span>
            </Form>
          )
        }
      </CardBody>
      <CardFooter>
        <Button
          className="w-full"
          color="secondary"
          variant="solid"
          onPress={() => {
            if (type === 'login') {
              onLogin();
            } else {
              onRegister();
            }
          }}
          isLoading={isLoading}>
          {
            type === 'login' ? 'Login' : 'Register'
          }
        </Button>
      </CardFooter>
    </Card>
  );
}

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import '../../node_modules/bootstrap-icons/font/bootstrap-icons.css';

export default function AuthForm({
  userEmail,
  setUserEmail,
  userPassword,
  setUserPassword,
  handleSignIn,
  handleSignUp,
  demoSignIn,
  handleForgotPassword,
  className,
  ...props
}) {
  const [passVisibility, setPassVisibility] = useState(false);
  const [register, setRegister] = useState(false);

  return (
    <div className="flex items-center justify-center p-3 sm:w-[60%]">
      <div
        className={cn(
          'auth-form flex flex-col gap-6 w-full max-w-md bg-white dark:bg-gray-800 transition duration-300 shadow-lg rounded-xl',
          className
        )}
        {...props}>
        <Card className="bg-white dark:bg-gray-800 transition duration-300">
          <CardHeader>
            <CardTitle className="text-2xl">
              {register ? 'Sign Up' : 'Login'}
            </CardTitle>
            <CardDescription className="transition duration-300">
              Enter email and password to{' '}
              {register ? `create a new account` : `login to your account`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                register ? handleSignUp() : handleSignIn();
              }}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    className="text-gray-900 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 transition duration-300"
                    id="email"
                    type="email"
                    placeholder="yourname@mail.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      onClick={handleForgotPassword}
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline cursor-pointer select-none">
                      Forgot your password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      className="text-gray-900 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 transition duration-300"
                      id="password"
                      type={passVisibility ? 'text' : 'password'}
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      tabIndex="-1"
                      onClick={() => setPassVisibility(!passVisibility)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-gray-400 transition duration-300">
                      <i
                        className={`bi ${
                          passVisibility ? 'bi-eye' : 'bi-eye-slash'
                        }`}></i>
                    </button>
                  </div>
                </div>
                <Button
                  variant="blue"
                  type="submit"
                  className="w-full">
                  {register ? 'Sign Up' : 'Login'}
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-zinc-200 dark:after:border-zinc-600 transition duration-300 after:transition after:duration-300">
                  <span className="relative z-10 bg-white px-2 text-zinc-500 dark:bg-gray-800 dark:text-zinc-400 transition duration-300">
                    Or continue with
                  </span>
                </div>
                <Button
                  variant="neutral"
                  onClick={demoSignIn}
                  className="w-full">
                  Login with Demo Account
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                {register
                  ? `Already have an account? `
                  : `Don't have an account? `}
                <a
                  onClick={() => setRegister(!register)}
                  className="underline underline-offset-4 cursor-pointer select-none">
                  {register ? 'Login' : 'Sign Up'}
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

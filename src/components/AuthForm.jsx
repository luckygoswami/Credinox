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
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {register ? 'Sign Up' : 'Login'}
            </CardTitle>
            <CardDescription>
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
                  </div>
                  <div className="relative">
                    <Input
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
                  type="submit"
                  className="w-full">
                  {register ? 'Sign Up' : 'Login'}
                </Button>
                <Button
                  variant="outline"
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
                  className="underline underline-offset-4 cursor-pointer">
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

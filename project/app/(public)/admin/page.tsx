'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, UserPlus, Shield, CircleCheck as CheckCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useRouter } from 'next/navigation';
import emailjs from "emailjs-com";
export default function AdminPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('login');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        company: '',
        pageName: '',
        mobile: ''
    });

    const handleLoginChange = (field: string, value: string) => {
        setLoginData(prev => ({ ...prev, [field]: value }));
    };

    const handleRegisterChange = (field: string, value: string) => {
        setRegisterData(prev => ({ ...prev, [field]: value }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Store user data in localStorage
                localStorage.setItem('adminUser', JSON.stringify({
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    company: data.user.company,
                    loginTime: new Date().toISOString()
                }));

                // Redirect to intended page or influencers list
                const redirectTo = localStorage.getItem('redirectAfterLogin') || '/influencers';
                localStorage.removeItem('redirectAfterLogin');
                router.push(redirectTo);
            } else {
                alert(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (registerData.password !== registerData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (registerData.password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: registerData.name,
                    email: registerData.email,
                    password: registerData.password,
                    company: registerData.company,
                    pageName: registerData.pageName,
                    mobile: registerData.mobile
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setIsSuccess(true);
                await emailjs.send(
                    "service_7h4qca9",
                    "template_ykqrack",
                    {
                        name: registerData.name,
                        email: registerData.email,
                        company: registerData.company,
                        pageName: registerData.pageName,
                        phone: registerData.mobile
                    },
                    "RI6ijkt2WR-Mgd9sj"
                );
                setTimeout(() => {
                    setActiveTab('login');
                    setIsSuccess(false);
                    setRegisterData({ name: '', email: '', password: '', confirmPassword: '', company: '', pageName: '', mobile: '' });
                }, 2000);
            } else {
                alert(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <Card className="w-full max-w-md shadow-xl border-0">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#000631] mb-2">Registration Successful!</h2>
                        <p className="text-gray-600 mb-4">
                            Your account has been created successfully. You can now login to access the platform.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#000631] to-[#EC6546] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                        <Shield className="w-5 h-5 text-white" />
                        <span className="text-white font-semibold">Admin Access</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome to InfluConnect</h1>
                    <p className="text-white/80">Please login or register to access the platform</p>
                </div>

                {/* Auth Card */}
                <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-center text-[#000631]">
                            Access Platform
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="login" className="data-[state=active]:bg-[#EC6546] data-[state=active]:text-white">
                                    Login
                                </TabsTrigger>
                                <TabsTrigger value="register" className="data-[state=active]:bg-[#EC6546] data-[state=active]:text-white">
                                    Register
                                </TabsTrigger>
                            </TabsList>

                            {/* Login Tab */}
                            <TabsContent value="login">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div>
                                        <Label htmlFor="loginEmail">Email Address</Label>
                                        <Input
                                            id="loginEmail"
                                            type="email"
                                            value={loginData.email}
                                            onChange={(e) => handleLoginChange('email', e.target.value)}
                                            required
                                            className="mt-1"
                                            placeholder="your.email@company.com"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="loginPassword">Password</Label>
                                        <Input
                                            id="loginPassword"
                                            type="password"
                                            value={loginData.password}
                                            onChange={(e) => handleLoginChange('password', e.target.value)}
                                            required
                                            className="mt-1"
                                            placeholder="Enter your password"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-[#EC6546] hover:bg-[#EC6546]/90 text-white"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <LoadingSpinner className="w-4 h-4 mr-2" />
                                                Logging in...
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="w-4 h-4 mr-2" />
                                                Login
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>

                            {/* Register Tab */}
                            <TabsContent value="register">
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div>
                                        <Label htmlFor="registerName">Full Name</Label>
                                        <Input
                                            id="registerName"
                                            value={registerData.name}
                                            onChange={(e) => handleRegisterChange('name', e.target.value)}
                                            required
                                            className="mt-1"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="registerEmail">Email Address</Label>
                                        <Input
                                            id="registerEmail"
                                            type="email"
                                            value={registerData.email}
                                            onChange={(e) => handleRegisterChange('email', e.target.value)}
                                            required
                                            className="mt-1"
                                            placeholder="your.email@company.com"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="registerMobile">Mobile No</Label>
                                        <Input
                                            id="registerMobile"
                                            type="mobile"
                                            value={registerData.mobile}
                                            onChange={(e) => handleRegisterChange('mobile', e.target.value)}
                                            required
                                            className="mt-1"
                                            placeholder="xxxxxxxxxx"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="registerCompany">Company/Organization</Label>
                                        <Input
                                            id="registerCompany"
                                            value={registerData.company}
                                            onChange={(e) => handleRegisterChange('company', e.target.value)}
                                            required
                                            className="mt-1"
                                            placeholder="Your company name"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="registerPageName">Page Name</Label>
                                        <Input
                                            id="registerPageName"
                                            value={registerData.pageName}
                                            onChange={(e) => handleRegisterChange('pageName', e.target.value)}
                                            required
                                            className="mt-1"
                                            placeholder="Your Page name"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="registerPassword">Password</Label>
                                        <Input
                                            id="registerPassword"
                                            type="password"
                                            value={registerData.password}
                                            onChange={(e) => handleRegisterChange('password', e.target.value)}
                                            required
                                            className="mt-1"
                                            placeholder="Create a password (min 6 characters)"
                                            minLength={6}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={registerData.confirmPassword}
                                            onChange={(e) => handleRegisterChange('confirmPassword', e.target.value)}
                                            required
                                            className="mt-1"
                                            placeholder="Confirm your password"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-[#000631] hover:bg-[#000631]/90 text-white"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <LoadingSpinner className="w-4 h-4 mr-2" />
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="w-4 h-4 mr-2" />
                                                Create Account
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-white/60 text-sm">
                        Secure access to InfluConnect platform
                    </p>
                </div>
            </div>
        </div>
    );
}
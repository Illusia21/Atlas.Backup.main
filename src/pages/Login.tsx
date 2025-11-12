import { useNavigate } from "react-router-dom";
import {useForm} from 'react-hook-form'
import type {SubmitHandler} from 'react-hook-form'
import mmcmLogo from "../assets/images/mmcmLogo.png"
import acoLogo from "../assets/images/ACO.png"
import { ACCESS_TOKEN,REFRESH_TOKEN } from '@/constants'
import api from "../api"
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet
} from "@/components/ui/field"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

type FormFields = {
    username: string //email
    password: string
}

function Login() {
    const {
        register, 
        handleSubmit,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<FormFields>();

    const navigate = useNavigate()

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try{
            const res = await api.post("/api/token/", data)
            localStorage.setItem(ACCESS_TOKEN, res.data.access)
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
            navigate("/")
        } catch (error:any){
            setError("root", {
                message: "Invalid email or password"
            })
        }
    }

    const handleMicrosoftLogin = () => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        window.location.href = `${apiUrl}/api/microsoft/login/`;
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="bg-[#FCFCFC] w-full max-w-lg p-6">
                <CardHeader className="flex items-center justify-center gap-4">
                    <img src={mmcmLogo} alt="Logo" className="h-22 sm:h-26 object-contain" />
                    <img src={acoLogo} alt="Logo" className="h-16 sm:h-20 object-contain" />
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {errors.root && <div className="text-red-500">{errors.root.message}</div>}
                        <FieldGroup>
                            <FieldSet disabled={isSubmitting}>
                                <Field>
                                    <FieldLabel>Email</FieldLabel>
                                    <Input {...register('username')} type="text" placeholder='Email'></Input>
                                </Field>
                                <Field>
                                    <FieldLabel className="flex justify-between">
                                        <div>Password</div>
                                        <div className='flex gap-1'>
                                            Forgot your Password? 
                                            <Link to="/forgot-password" className="text-blue-600 underline">Click here</Link>
                                        </div>                    
                                    </FieldLabel>
                                    <Input {...register('password')} autoComplete="new-password" type="password" placeholder='Password'></Input>
                                </Field>
                                <Field orientation="vertical">
                                    <Button type="submit" className="rounded-[24px] h-[45px]">Login</Button>
                                    <Button  onClick={handleMicrosoftLogin} variant="secondary" type="button" className='rounded-[24px] h-[45px] border border-[#001C43]'>Login with a Microsoft Account</Button>
                                </Field>
                            </FieldSet>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login
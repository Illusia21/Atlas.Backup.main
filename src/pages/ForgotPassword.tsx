import { useState } from 'react'
import {useForm} from 'react-hook-form'
import type {SubmitHandler} from 'react-hook-form'
import api from "../api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldGroup,
  FieldSet
} from "@/components/ui/field"
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

type FormFields = {
    email: string
}

function ForgotPassword() {
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const {
        register, 
        handleSubmit,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<FormFields>();

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        setSuccessMessage(null)
        try{
            const res = await api.post("/api/forgot-password/", data)
            setSuccessMessage(res.data.message)

        } catch (error:any){
            setError("email", {
                message: "Email does not exist"
            })
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="bg-[#FCFCFC] w-full max-w-lg p-6">
                <CardHeader className="flex flex-col gap-4">
                    <CardTitle>Forgot Your Password?</CardTitle>
                    <CardDescription>Enter your account email and we’ll send you instructions to reset your password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {successMessage && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                                {successMessage}
                            </div>
                        )}
                        {errors.email && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                                {errors.email.message}
                            </div>
                        )}
                        <FieldGroup>
                            <FieldSet disabled={isSubmitting}>
                                <Field>
                                    <Input {...register('email')} type="text" placeholder='Email'></Input>
                                </Field>
                                <Field orientation="vertical">
                                    <Button type="submit" className="w-[100px]">{isSubmitting ? 'Sending...' : 'Send Reset Link'}</Button>
                                </Field>
                            </FieldSet>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default ForgotPassword
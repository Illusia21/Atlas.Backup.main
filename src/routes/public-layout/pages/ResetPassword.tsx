/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import {useForm} from 'react-hook-form'
import type {SubmitHandler} from 'react-hook-form'
import {useParams,useNavigate} from 'react-router-dom'
import api from "../../../api"
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldDescription
} from "@/components/ui/field"
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

const schema = z.object({
    new_password: z
    .string()
    .min(8,"password must contain atleast 8 characters")
    .refine(
      (val) =>
        /[A-Z]/.test(val) && // at least one uppercase
        /[a-z]/.test(val) && // at least one lowercase
        /\d/.test(val),      // at least one number
      {
        message: "Invalid password. Please review the requirements.",
      }
    ),

    confirm_password: z.string()
    }).refine((data) => data.new_password === data.confirm_password, {
        message: "Passwords do not match",
        path: ["confirm_password"]
});

type FormFields = z.infer<typeof schema>

function ResetPassword() {
    const { uid, token } = useParams<{ uid: string; token: string }>()
    const navigate = useNavigate()
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const {
        register, 
        handleSubmit,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        setSuccessMessage(null)
        try{
            const res = await api.post("/api/reset-password/", {
                uid: uid,
                token: token,
                new_password: data.new_password
            })
            setSuccessMessage(res.data.message || 'Password reset successful!')

            setTimeout(() => {
                navigate('/login')
            }, 3000)
        } catch (error:any){
            setError("new_password", {
                message: "Something went wrong"
            })
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="bg-[#FCFCFC] w-full max-w-lg p-6">
                <CardHeader className="flex flex-col gap-4">
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>Enter your new password below. Make sure it meets the security requirements.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {successMessage && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                                <p>{successMessage}</p>
                                <p className="text-sm mt-2">Redirecting to login...</p>
                            </div>
                        )}
                        <FieldGroup>
                            <FieldSet disabled={isSubmitting}>
                                <Field>
                                    <FieldLabel>New Password</FieldLabel>
                                    <Input {...register('new_password')} type="password"></Input>
                                    {errors.new_password && (
                                        <span className="text-red-500 text-sm">
                                            {errors.new_password.message}
                                        </span>
                                    )}
                                    <FieldDescription>
                                        <ul className="list-disc pl-5">
                                            <li>Atleast 8 characters.</li>
                                            <li>Atleast one uppercase letter.</li>
                                            <li>Atleast one lowercase letter.</li>
                                            <li>Atleast one number.</li>
                                        </ul>
                                    </FieldDescription>
                                </Field>
                                <Field>
                                    <FieldLabel>Re-enter new password</FieldLabel>
                                    <Input  {...register('confirm_password')} type="password"></Input>
                                    {errors.confirm_password && (
                                        <span className="text-red-500 text-sm">
                                            {errors.confirm_password.message}
                                        </span>
                                    )}
                                </Field>
                                <Field orientation="vertical">
                                    <Button type="submit" className="w-[100px]">Reset Password</Button>
                                </Field>
                            </FieldSet>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default ResetPassword
"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";

import loginImg from "@/assets/login-img.png"

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography/typography";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      await login(data.email, data.password);
      navigate("/dashboard/connections");
    } catch (err: unknown) {
      if (err instanceof Error) {
        const message = err.message;

        if (message.includes("invalid-credential")) {
          toast.error("Email ou senha inválidos.");
        } else if (message.includes("user-not-found")) {
          toast.error("Usuário não encontrado.");
        } else if (message.includes("wrong-password")) {
          toast.error("Senha incorreta.");
        } else if (message.includes("too-many-requests")) {
          toast.error("Muitas tentativas. Tente novamente mais tarde.");
        } else {
          toast.error("Erro ao fazer login. Tente novamente.");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen items-center px-4 justify-center">

      <Card className=" w-full md:max-w-2xl gap-0 flex flex-row p-0">
        <img src={loginImg} className=" flex-1 w-1/2 hidden md:block rounded-2xl" />
        <div className="flex w-full md:w-1/2 p-5 items-center">
          <div className="w-full">
            <div className="mb-3">

              <p className="text-2xl">👋 </p>
              <Typography type="heading-s" className="font-semibold">
                Bem vindo ao futuro
              </Typography>
            </div>
            <form
              className="w-full space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-muted-foreground">Seu e-mail</FieldLabel>
                    <Input

                      aria-invalid={fieldState.invalid}
                      className="w-full bg-primary/10"
                      placeholder="Email"
                      type="email"
                      {...field}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-muted-foreground">Sua senha</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      className="w-full bg-primary/10"
                      placeholder="Senha"
                      type="password"
                      {...field}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Button
                className="mt-4 w-full"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            <div className="mt-5 space-y-5">
              <Typography type="body-s" className="text-center text-muted-foreground">
                Não tem uma conta?{" "}
                <Link
                  className="ml-1 text-muted-foreground underline"
                  to="/register"
                >
                  Criar conta
                </Link>
              </Typography>
            </div>
          </div>
        </div>
      </Card>
      <div className="absolute bottom-5">
        <Typography>
          Desenvolvido por  <Link
            className="font-bold text-primary hover:text-primary/80 duration-300"
            to="https://www.silasafra.com/pt" target="_blank"
          >
            Silas Afra
          </Link>
        </Typography>
      </div>
    </div>
  );
};



export default LoginPage;
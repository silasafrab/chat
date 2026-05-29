"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";

import heroImg from "@/assets/login-img.png";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography/typography";

const formSchema = z
  .object({
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError("");
    setIsSubmitting(true);

    try {
      await register(data.email, data.password);
      navigate("/dashboard/connections");
    } catch (err: unknown) {
      if (err instanceof Error) {
        const message = err.message;

        if (message.includes("email-already-in-use")) {
          setError("Este email já está em uso.");
        } else if (message.includes("weak-password")) {
          setError("Senha muito fraca.");
        } else {
          setError("Erro ao criar conta. Tente novamente.");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen items-center px-4 justify-center">

      <Card className="w-full md:max-w-2xl gap-0 flex flex-row p-0">
        <img src={heroImg} className="flex-1 w-1/2 hidden md:block rounded-2xl object-cover" />
        <div className="flex w-full md:w-1/2 p-5 items-center">
          <div className="w-full">
            <div className="mb-3">

              <Typography type="heading-s" className="font-semibold">
                Criar sua conta
              </Typography>
            </div>

            {error && (
              <p className="mb-4 w-full rounded-md bg-destructive/10 p-3 text-center text-sm text-destructive">
                {error}
              </p>
            )}

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
              <Controller
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-muted-foreground">Confirmar senha</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      className="w-full bg-primary/10"
                      placeholder="Confirmar senha"
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
                {isSubmitting ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>

            <div className="mt-5">
              <Typography type="body-s" className="text-center text-muted-foreground">
                Já tem uma conta?{" "}
                <Link
                  className="ml-1 text-muted-foreground underline"
                  to="/"
                >
                  Fazer login
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

export default RegisterPage;
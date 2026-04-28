"use client";

import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Textarea } from "../ui/textarea";
import { getRandomValues } from "node:crypto";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";
interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

const AccountProfile = ({ user, btnTitle}: Props) => {

  const [files, setFiles] = useState<File[]>([])
  const {startUpload} = useUploadThing("media")
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  });

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void,
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.includes("image")) return;
       setFiles([file]);

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: z.infer<typeof UserValidation>) => {
    let imageUrl = data.profile_photo;

    // Only upload if it's a new image (base64 preview)
    if (imageUrl.startsWith("data:")) {
      const imgRes = await startUpload(files);

      if (!imgRes || imgRes.length === 0) return;

      imageUrl = imgRes[0].url; // ✅ ONLY STORE URL
    }
    await updateUser({
      userId: user.id,
      username: data.username,
      name: data.name,
      bio: data.bio,
      image: imageUrl,
      path: pathname,
    });
        router.push(pathname === "/profile/edit" ? "/profile" : "/");
    router.refresh();

    /*if(pathname === '/profile/edit'){
      router.back()

    }else{
      router.push('/')

    }*/

  }

  return (
    <Card className="w-full sm:max-w-xl ">
      <CardHeader>
        <CardTitle>Bug Report!</CardTitle>
        <CardDescription>
          Help us improve by reporting bugs you encounter.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="profile_photo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center gap-4">
                    <FieldLabel className="account-form_image-label">
                      {field.value ? (
                        <Image
                          src={field.value}
                          alt="profile photo"
                          width={96}
                          height={96}
                          priority
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <Image
                          src="/assets/profile.svg"
                          alt="profile photo"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      )}
                    </FieldLabel>

                    <Input
                      type="file"
                      accept="image/*"
                      className="flex-1"
                      onChange={(e) => handleImage(e, field.onChange)}
                    />
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="grid grid-cols-[80px_1fr] items-center gap-2 mt-2">
                    <FieldLabel className="">Name</FieldLabel>

                    <Input
                      className="flex-1"
                      {...field}
                      type="text"
                      autoComplete="off"
                    />
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="grid grid-cols-[80px_1fr] items-center gap-2 mt-2">
                    <FieldLabel className="">Username</FieldLabel>

                    <Input
                      className="flex-1"
                      {...field}
                      type="text"
                      autoComplete="off"
                    />
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="bio"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="grid grid-cols-[80px_1fr] items-center gap-2 mt-2">
                    <FieldLabel className="">Bio</FieldLabel>

                    <Textarea rows={10} {...field} className="resize-none" />
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Field orientation="horizontal">
          <Button type="submit" form="form-rhf-demo" className="w-full">
            {btnTitle}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default AccountProfile;

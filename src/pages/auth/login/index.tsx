import { t } from "@/helpers";
import { useAppDispatch } from "@/store";
import SignIn from "@/store/auth/service";
import type { FieldType } from "@/types";
import { Button, Form, Input, Spin, type FormProps } from "antd";
import { useState } from "react";

export default function Login() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  // 🔹 Form submit
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      setLoading(true);
      const credentials = {
        username: values?.username,
        password: values?.password,
      };

      const result = await dispatch(
        SignIn({ data: credentials, type: "login" })
      );

      console.log("Login result:", result);

      // 🔹 Agar login muvaffaqiyatli bo‘lsa
      if ((result as any)?.payload?.data?.access) {
        window.location.href = "/"; // Bosh sahifaga o‘tkazish
      }
    } catch (error) {
      console.error("LoginError:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[100vh]">
      <Form onFinish={onFinish} className="w-96" layout="vertical">
        <Spin spinning={loading}>
          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              {t("Enter")}
            </Button>
          </Form.Item>
        </Spin>
      </Form>
    </div>
  );
}

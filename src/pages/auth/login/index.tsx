import { t } from "@/helpers";
import { useAppDispatch } from "@/store";
import SignIn from "@/store/auth/service";
import { Button, Col, Form, Input, Row, Spin, type FormProps } from "antd";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import settingsAnimation from "@/assets/lotti/settings.json";
import AOS from "aos";
import "aos/dist/aos.css";
import { createLoginFormData } from "@/api/auth_api";
import type { FieldType } from "@/types";

export default function Login() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  // 🔹 Form submit
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      setLoading(true);

      const { formData } = createLoginFormData(
        values?.username,
        values?.password
      );

      const credentials = {
        username: values?.username,
        password: values?.password,
      };

      const result = await dispatch(SignIn({ data: formData, type: "login" }));
      
      // 🔹 Agar login muvaffaqiyatli bo'lsa
      if ((result as any)?.payload?.access_token) {
        window.location.href = "/"; // Bosh sahifaga o'tkazish
      }
    } catch (error) {
      console.error("LoginError:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="h-screen">
      <Col xs={0} xl={12} className="h-full">
        <div className="flex items-center justify-center h-full mr-3">
          <div className="w-[80%]">
            <Lottie animationData={settingsAnimation} />
          </div>
        </div>
      </Col>
      <Col xs={24} xl={12} className="h-full">
        <div className="flex items-center justify-center h-full">
          <div className="w-[90%] xl:w-1/2 px-6 max-w-md mx-auto">
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-duration="800">
              <h3 className="rn-title text-center text-transparent bg-clip-text font-bold bg-gradient-to-r leading-snug tracking-wide drop-shadow-md">
                O'zbekiston Respublikasi Ichki ishlar vazirligi{" "}
                <br className="block sm:hidden" />
                Jamoat xavfsizligi departamenti
                <br className="hidden sm:block" />
                Yo'l harakati xavfsizligi xizmati
              </h3>
              <div className="mt-3 flex justify-center !my-3">
                <div className="h-0.5 w-24 bg-gradient-to-r from-yellow-400 to-red-600 rounded-full"></div>
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="1000">
              <p className="rn-description text-center text-xs sm:text-sm md:text-base text-gray-200 mt-4 leading-relaxed px-2 font-medium italic bg-opacity-10 backdrop-blur-sm py-3">
                Avtomototransport vositalari haydovchilarini tayyorlash, qayta
                tayyorlash va malakasini oshirishga o'rgatuvchi ta'lim
                muassasalari axborot tizimi
              </p>
            </div>
            <Form onFinish={onFinish} layout="vertical" className="mt-8">
              <Spin
                spinning={loading}
                size="large"
                tip={<span>Sabir qiling...</span>}>
                <div data-aos="fade-up" data-aos-delay="300">
                  <Form.Item<FieldType>
                    label={<span className="font-medium">Login</span>}
                    name="username"
                    rules={[{ required: true, message: "Loginni kiriting!" }]}>
                    <Input
                      size="large"
                      placeholder="Loginni yozing..."
                      className="w-full rounded-lg"
                    />
                  </Form.Item>
                </div>

                <div data-aos="fade-up" data-aos-delay="500">
                  <Form.Item<FieldType>
                    label={<span className="font-medium">Parol</span>}
                    name="password"
                    rules={[{ required: true, message: "Parolni kiriting!" }]}>
                    <Input.Password
                      size="large"
                      placeholder="Parolni yozing..."
                      className="w-full rounded-lg"
                    />
                  </Form.Item>
                </div>

                <div data-aos="fade-up" data-aos-delay="700">
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      className="w-full bg-blue-600 hover:bg-blue-700 font-semibold">
                      {t("Enter")}
                    </Button>
                  </Form.Item>
                </div>
              </Spin>
            </Form>
          </div>
        </div>
      </Col>
    </Row>
  );
}

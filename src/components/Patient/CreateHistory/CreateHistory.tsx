import { fetchPatient, sendPatient } from "@/services/ClinicNoteAPI";
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import "./styles.scss";
import { ClinicHistory } from "@/commons/types";

const { Option } = Select;
const { TextArea, Search } = Input;
const prefixSelector = <Form.Item noStyle>+57</Form.Item>;
dayjs.extend(relativeTime);

export function CreateHistory() {
  const [formDisabled, setFormDisabled] = useState<boolean>(true);
  const [alertMessage, setAlertMessage] = useState<String>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const navigate = useNavigate();
  const [historyPatient] = Form.useForm();
  const onFinish = (values: any) => {
    let data = {
      id_patient: parseFloat(values.id_patient),
      names_patient: values.names_patient,
      lastnames_patient: values.lastnames_patient,
      birthday_patient: dayjs(values.birthday_patient).format("YYYY-MM-DD"),
      gender_patient: values.gender_patient,
      phone_patient: parseFloat(values.phone_patient),
      address_patient: values.address_patient,
      city_patient: values.city_patient,
      civilstatus_patient: values.civilstatus_patient,
      timestamp_ch_detail: dayjs(values.historyTimestamp).format(
        "YYYY-MM-DD HH:mm"
      ),
      reason_ch_detail: values.reason_ch_detail,
      weight_ch_detail: values.weight_ch_detail,
      height_ch_detail: values.height_ch_detail,
      recommendation_ch_detail: values.recommendation_ch_detail,
    };
    sendPatient(data, (response) => {
      response ? navigate("/patient/list") : null;
    });
    console.log(data);
  };

  const alert = (msg: string) => {
    setAlertMessage(msg);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 10000);
  };

  const getVariable = (isAdult: boolean, value: string) => {
    let response = null;
    if (isAdult) {
      response = Math.sqrt(parseFloat(value.slice(-2))).toFixed(2);
    } else {
      let a = 0,
        b = 1,
        temp;
      while (b < parseFloat(value)) {
        temp = a + b;
        a = b;
        b = temp;
        if (b < parseFloat(value)) response = b;
      }
      console.log(response);
    }
    return response?.toString();
  };

  const onValuesChange = () => {
    let recommendation = "";
    let cantidad = "";
    let valorCalculado = null;
    let pronombre = "";
    let peso = historyPatient.getFieldValue("weight_ch_detail");

    let name = `${historyPatient.getFieldValue(
      "names_patient"
    )} ${historyPatient.getFieldValue("lastnames_patient")}`;
    historyPatient.getFieldValue("gender_patient") == "M"
      ? (pronombre = "un")
      : (pronombre = "una");
    let birthday = dayjs(
      historyPatient.getFieldValue("birthday_patient")
    ).format("YYYY-MM-DD");

    if (parseFloat(dayjs(birthday).toNow().split(" ")[1]) >= 18) {
      console.log("Es mayor de edad");
      valorCalculado = getVariable(true, birthday);
      if (parseFloat(peso) >= 30) {
        cantidad = "mas";
      } else {
        cantidad = "menos";
      }
      recommendation = `Hola ${name} eres una persona muy saludable, te recomiendo comer ${cantidad} y salir a correr ${valorCalculado} km diarios`;
    } else {
      console.log("Es menor de edad");
      valorCalculado = getVariable(false, peso);
      recommendation = `Hola ${name} eres ${pronombre} joven muy saludable, te recomiendo salir a jugar al aire libre durante ${valorCalculado} horas diarias`;
    }

    historyPatient.setFieldValue("recommendation_ch_detail", recommendation);
  };

  const onSearch = (value: string) => {
    if (value) {
      fetchPatient(value, (data: ClinicHistory) => {
        if (!data?.error) {
          setFormDisabled(false);
          let tim = dayjs(data.birthday_patient).format("YYYY-MM-DD");
          historyPatient.setFieldsValue({
            names_patient: data.names_patient,
            lastnames_patient: data.lastnames_patient,
            gender_patient: data.gender_patient,
            phone_patient: data.phone_patient,
            address_patient: data.address_patient,
            city_patient: data.city_patient,
            civilstatus_patient: data.civilstatus_patient,
            birthday_patient: dayjs(tim).locale("es"),
          });
        } else {
          setFormDisabled(false);
          alert("No data found for this patient ID");
          historyPatient.resetFields();
          historyPatient.setFieldValue("id_patient", value);
        }
      });
    } else {
      alert("Please input a ID Patient");
      historyPatient.resetFields();
      setFormDisabled(true);
    }
  };
  return (
    <>
      <Card className="_card-history-form">
        <Form
          form={historyPatient}
          name="historyPatient"
          onFinish={onFinish}
          size="large"
          disabled={formDisabled}
          onFieldsChange={onValuesChange}
        >
          <Row gutter={12}>
            <Col span={6}>
              <Form.Item
                name="id_patient"
                rules={[
                  { required: true, message: "Please input ID Patient!" },
                ]}
              >
                <Search
                  placeholder="ID Patient"
                  onSearch={onSearch}
                  enterButton
                  disabled={false}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {showAlert ? (
                <Alert message={alertMessage} banner closable />
              ) : null}
            </Col>
            <Col span={6}>
              <Form.Item
                name="historyTimestamp"
                rules={[
                  {
                    type: "object" as const,
                    required: true,
                    message: "Please select timestamp!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placement="bottomRight"
                  placeholder="Consult date"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="names_patient"
                rules={[
                  { required: true, message: "Please input patient names!" },
                ]}
              >
                <Input placeholder="Names" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastnames_patient"
                rules={[
                  {
                    required: true,
                    message: "Please input patient lastnames!",
                  },
                ]}
              >
                <Input placeholder="Lastnames" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={6}>
              <Form.Item
                name="birthday_patient"
                rules={[
                  {
                    type: "object" as const,
                    required: true,
                    message: "Please select birthday!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  showTime
                  format="YYYY-MM-DD"
                  placement="bottomRight"
                  placeholder="Birthday"
                  onChange={(value) => {
                    console.log(value);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="gender_patient"
                rules={[
                  {
                    required: true,
                    message: "Please input patient gender!",
                  },
                ]}
              >
                <Select placeholder="Gender">
                  <Option value="M">Male</Option>
                  <Option value="F">Female</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="civilstatus_patient"
                rules={[
                  {
                    required: true,
                    message: "Please input patient civil status!",
                  },
                ]}
              >
                <Select placeholder="Civil status">
                  <Option value="single">Single</Option>
                  <Option value="married">Married</Option>
                  <Option value="widow">Widow</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={6}>
              <Form.Item
                name="phone_patient"
                rules={[
                  {
                    required: true,
                    message: "Please input patient phone number!",
                  },
                ]}
              >
                <Input
                  addonBefore={prefixSelector}
                  style={{ width: "100%" }}
                  placeholder="Phone number"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="address_patient"
                rules={[
                  {
                    required: true,
                    message: "Please input patient address!",
                  },
                ]}
              >
                <Input placeholder="Address" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="city_patient"
                rules={[
                  {
                    required: true,
                    message: "Please input patient city!",
                  },
                ]}
              >
                <Input placeholder="City" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item
                name="reason_ch_detail"
                rules={[
                  {
                    required: true,
                    message: "Please input consult reason!",
                  },
                ]}
              >
                <TextArea
                  showCount
                  maxLength={500}
                  style={{ height: 120, resize: "none" }}
                  placeholder="Consult reason"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={6}>
              <Form.Item
                name="weight_ch_detail"
                rules={[
                  { required: true, message: "Please input patient weight!" },
                ]}
              >
                <InputNumber<string>
                  style={{ width: "100%" }}
                  min="0"
                  step="0.01"
                  stringMode={false}
                  placeholder="Weight"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="height_ch_detail"
                rules={[
                  { required: true, message: "Please input patient height!" },
                ]}
              >
                <InputNumber<string>
                  style={{ width: "100%" }}
                  min="0"
                  step="0.01"
                  stringMode={false}
                  placeholder="Height"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item
                name="recommendation_ch_detail"
                rules={[
                  {
                    required: true,
                    message: "Please input all data!",
                  },
                ]}
              >
                <TextArea
                  showCount
                  maxLength={500}
                  style={{ height: 120, resize: "none" }}
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" gutter={12}>
            <Col>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Col>
            <Col>
              <Form.Item>
                <Link to="/patient/list">
                  <Button danger>Cancel</Button>
                </Link>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}

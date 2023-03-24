import { ClinicHistory, Detail } from "@/commons/types";
import {
  deleteDetail,
  deletePatient,
  fetchHistories,
  fetchPatients,
} from "@/services/ClinicNoteAPI";
import {
  Button,
  Card,
  Descriptions,
  Modal,
  Popconfirm,
  Space,
  Timeline,
  TimelineItemProps,
  Typography,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import "./List.scss";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const { Text, Paragraph } = Typography;

export function List() {
  const [dataTable, setDataTable] = useState<DataType[]>([]);
  const [dataTimeline, setDataTimeline] = useState<Array<TimelineItemProps>>(
    []
  );
  const [open, setOpen] = useState(false);

  const columns: ColumnsType<DataType> = [
    {
      title: "Patient",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "DNI",
      dataIndex: "dni",
      key: "dni",
      sorter: true,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (key) => (
        <Space wrap>
          <Button type="link" onClick={() => handleHistories(key)}>
            View History
          </Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(key, "patient")}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleHistories = (key: string) => {
    fetchHistories(key, (data: Array<Detail>) => {
      setOpen(true);
      setDataTimeline(
        data.map((item: Detail) => {
          return {
            children: (
              <Card
                actions={[
                  <Popconfirm
                    title="Sure to delete?"
                    onConfirm={() =>
                      handleDelete(item.id_detail.toString(), "detail")
                    }
                  >
                    <Button danger>
                      <DeleteOutlined />
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <Descriptions
                  layout="vertical"
                  title={
                    <>
                      Consult day:
                      <Text type="secondary">
                        {" "}
                        {item.timestamp_ch_detail.toString()}
                      </Text>
                    </>
                  }
                >
                  <Descriptions.Item label="Weight">
                    {item.weight_ch_detail}
                  </Descriptions.Item>
                  <Descriptions.Item label="Height">
                    {item.height_ch_detail}
                  </Descriptions.Item>
                  <Descriptions.Item label="Consult reason">
                    {item.reason_ch_detail}
                  </Descriptions.Item>
                  <Descriptions.Item label="Recommendation">
                    {item.recommendation_ch_detail}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            ),
          };
        })
      );
    });
  };

  const handleDelete = (key: string, target: string) => {
    switch (target) {
      case "patient":
        deletePatient(key);
        break;
      case "detail":
        deleteDetail(key);
        setOpen(false);
        break;
    }
  };

  useEffect(() => {
    fetchPatients((data: Array<ClinicHistory>) => {
      let dataTable = [];
      let x = 1;
      data.forEach((item: ClinicHistory) => {
        dataTable.push({
          key: x,
          name: `${item.names_patient} ${item.lastnames_patient}`,
          dni: item.id_patient,
          phone: item.phone_patient,
          address: item.address_patient,
          city: item.city_patient,
          action: item.id_patient,
        });
        x++;
      });
      setDataTable(dataTable);
    });
  }, []);
  return (
    <>
      <Card>
        <Table columns={columns} dataSource={dataTable} />
      </Card>
      <Modal
        title="Patient Histories"
        centered
        open={open}
        width={1000}
        onCancel={() => {
          setOpen(false);
        }}
        footer={null}
      >
        <Timeline reverse items={dataTimeline} />
      </Modal>
    </>
  );
}

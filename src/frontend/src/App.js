import {Avatar, Badge, Button, Empty, Spin, Table, Tag, Radio, Popconfirm, Divider} from "antd";
import {useState, useEffect} from 'react';
import {getAllStudents} from "./client";

import { Layout, Menu, Breadcrumb } from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined, LoadingOutlined, PlusOutlined,
} from '@ant-design/icons';

import StudentDrawerForm from "./StudentDrawerForm";
import {removeStudent} from "./client";

import './App.css';
import {errorNotification, successNotification} from "./Notification";


const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const TheAvatar = ({name}) => {
    let trim = name.trim();
    if (trim.length === 0) {
        return <Avatar icon={UserOutlined} />
    }
    const split = trim.split(' ');
    if (split.length === 1) {
        return <Avatar>{name.charAt(0)}</Avatar>
    }
    return <Avatar>{`${name.charAt(0)}${name.charAt(-1)}`}</Avatar>
}

const deleteStudent = (id, fetchStudents) => {
    removeStudent(id)
        .then(() => {
            successNotification('Student deleted', `Student ${id} was deleted`)
        })
        .catch((err) => {
            console.error(err);
            err.response.json().then(res => {
                errorNotification(
                    'There was an issue',
                    `${res.message} [${res.status}] [${res.error}]`
                );
            });
        })
        .finally(() => {
            fetchStudents();
        });
}

const columns = (fetchStudents) => [
    {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (text, student) => {
            return <TheAvatar name={student.name} />
        }
    },
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (text, student) => {
            return <>
                <Radio.Group>
                    <Popconfirm
                        title={`Are you sure you want to delete ${student.name}`}
                        onConfirm={() => deleteStudent(student.id, fetchStudents)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Radio.Button value='default'>Delete</Radio.Button>
                    </Popconfirm>,
                    <Radio.Button value='default'>Edit</Radio.Button>
                </Radio.Group>
            </>;
        }
    }
];

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function App() {

    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);

    const fetchStudents = () => {
        getAllStudents()
            .then(res => res.json())
            .then(data => {
                setStudents(data);
            })
            .catch(err => {
                console.log(err.response);
                err.response.json().then(res => {
                    console.log(res);
                    errorNotification('There was an issue', `[${res.status}] [${res.error}] res.message`);
                });
            })
            .finally(() => {
                setFetching(false);
            });
    }

    useEffect(() => {
        console.log('component is mounted');
        fetchStudents();
    }, []);

    const renderStudents = () => {
        if (fetching) {
            return <Spin indicator={antIcon} />;
        }
        if (students.length <= 0) {
            return <>
                <Button type="primary" shape="round"
                        icon={<PlusOutlined />}
                        size='small' onClick={() => setShowDrawer(!showDrawer)} >
                    Add New Student
                </Button>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents={fetchStudents}
                />
                <Empty />
            </>;
        }
        return <>
            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudents={fetchStudents}
            />
            <Table dataSource={students}
                   columns={columns(fetchStudents)}
                   bordered
                   title={() =>
                       <>
                           <Tag>Number of students</Tag>
                           <Badge count={students.length} className="site-badge-count-4" />
                           <br/><br/>
                           <Button type="primary" shape="round"
                                   icon={<PlusOutlined />}
                                   size='small' onClick={() => setShowDrawer(!showDrawer)} >
                               Add New Student
                           </Button>
                       </>
                       }
                   pagination={{ pageSize: 50 }}
                   scroll={{ y: 240 }}
                   rowKey={(student) => student.id}/>
        </>;
    }

    return <>
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(c) => setCollapsed(c)}>
                <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="1" icon={<PieChartOutlined />}>
                        Option 1
                    </Menu.Item>
                    <Menu.Item key="2" icon={<DesktopOutlined />}>
                        Option 2
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                        <Menu.Item key="3">Tom</Menu.Item>
                        <Menu.Item key="4">Bill</Menu.Item>
                        <Menu.Item key="5">Alex</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                        <Menu.Item key="6">Team 1</Menu.Item>
                        <Menu.Item key="8">Team 2</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="9" icon={<FileOutlined />}>
                        Files
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }} />
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-background" style={{ padding: 24 }}>
                        {renderStudents()}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    By Diego Laurentino ??2021
                    <Divider>
                        <a  rel='noopener noreferrer'
                            target='_blank'
                            href='https://github.com/LauretsDev'>
                            Click here for my Github Profile
                        </a>
                    </Divider>
                </Footer>
            </Layout>
        </Layout>
    </>;
}

export default App;

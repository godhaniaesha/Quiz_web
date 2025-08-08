import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Table } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight, FaUser } from 'react-icons/fa';
import '../style/d_style.css';
import Layout from '../component/Layout';

// Sample user data
const usersData = {
  '2025-08-01': [
    { email: 'alice@example.com', tech: ['JavaScript', 'React'], score: 88 },
    { email: 'bob@example.com', tech: ['Python'], score: 92 },
  ],
  '2025-08-05': [
    { email: 'charlie@example.com', tech: ['Java', 'SQL'], score: 81 }
  ],
  '2025-08-07': [
    { email: 'david@example.com', tech: ['React', 'Node.js'], score: 84 },
  ],
  '2025-08-10': [
    { email: 'eve@example.com', tech: ['Node.js', 'MongoDB'], score: 91 },
    { email: 'frank@example.com', tech: ['Python'], score: 79 },
  ],
};

const Dashboard = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const handleNextMonth = () => {
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const handleCellClick = (dateStr, users) => {
    setSelectedDate(dateStr);
    setSelectedUsers(users);
    setShowModal(true);
  };

 const renderCalendar = () => {
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = getDaysInMonth(currentMonth, currentYear);
  const calendarCells = [];
  let day = 1;

  const todayDateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  for (let week = 0; week < 6; week++) {
    const row = [];
    for (let d = 0; d < 7; d++) {
      if ((week === 0 && d < firstDay) || day > totalDays) {
        row.push(<td key={d} className="d_CP_empty-cell"></td>);
      } else {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const users = usersData[dateStr];
        const isToday = dateStr === todayDateStr;

        row.push(
          <td
            key={d}
            className={`d_CP_calendar-cell ${users ? 'd_CP_has-users' : ''} ${isToday ? 'd_today' : ''}`}
            onClick={() => users && handleCellClick(dateStr, users)}
          >
            <div className="d_CP_cell-content">
              <div className="d_CP_date">{day}</div>
              {users && (
                <div className="d_CP_user-badge">
                  <FaUser className="me-1" />
                  {users.length}
                </div>
              )}
            </div>
          </td>
        );
        day++;
      }
    }
    calendarCells.push(<tr key={week}>{row}</tr>);
  }

  return calendarCells;
};

  return (
    <Layout>
      <Container fluid className="d_CP_calendar-wrapper py-4">
        <Row className="justify-content-center mb-3">
          <Col xs={12} className="text-center">
            <h3 className="fw-bold" style={{color:'#6159a1'}}>Quiz Performance Calendar</h3>
            <p className="text-muted">Click on dates to view users' combined quiz results</p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Card className="d_CP_calendar-card shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center d_CP_calendar-header">
                <Button variant="light" onClick={handlePrevMonth}>
                  <FaChevronLeft />
                </Button>
                <h5 className="m-0 text-white">
                  {monthNames[currentMonth]} {currentYear}
                </h5>
                <Button variant="light" onClick={handleNextMonth}>
                  <FaChevronRight />
                </Button>
              </Card.Header>

              <Card.Body className="p-0">
                <table className="table table-bordered m-0 text-center d_CP_calendar-table">
                  <thead>
                    <tr className="d_CP_calendar-weekdays">
                      {daysOfWeek.map((day) => (
                        <th key={day}>{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{renderCalendar()}</tbody>
                </table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal for user performance */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>User Performance - {selectedDate}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUsers.length === 0 ? (
              <p>No data available.</p>
            ) : (
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Email</th>
                    <th>Techs</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUsers.map((user, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{user.email}</td>
                      <td>{user.tech.join(', ')}</td>
                      <td>{user.score}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </Layout>
  );
};

export default Dashboard;

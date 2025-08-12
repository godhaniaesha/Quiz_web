import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Table } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { db_getAllQuizzes } from "../redux/slice/quiz.slice";
import '../style/d_style.css';
import Layout from '../component/Layout';

const Dashboard = () => {
  const dispatch = useDispatch();

  // Redux quizzes state
  const { quizzes } = useSelector(state => state.quiz);

  // Calendar state
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Modal state for inactive quizzes on selected date
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);

  // Map of date string -> count of inactive quizzes on that date
  const [inactiveCountsByDate, setInactiveCountsByDate] = useState({});

  // List of inactive quizzes grouped by date for modal display
  const [inactiveQuizzesByDate, setInactiveQuizzesByDate] = useState({});

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  useEffect(() => {
    dispatch(db_getAllQuizzes());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(quizzes)) {
      // Filter inactive quizzes
      const inactiveQuizzes = quizzes.filter(
        q => q.status && q.status.toLowerCase() === 'inactive'
      );

      // Group by updatedAt date (YYYY-MM-DD)
      const counts = {};
      const grouped = {};

      inactiveQuizzes.forEach(quiz => {
        if (quiz.updatedAt) {
          const date = new Date(quiz.updatedAt).toISOString().slice(0, 10);
          counts[date] = (counts[date] || 0) + 1;
          grouped[date] = grouped[date] || [];
          grouped[date].push(quiz);
        }
      });

      setInactiveCountsByDate(counts);
      setInactiveQuizzesByDate(grouped);
    }
  }, [quizzes]);

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

  const handleCellClick = (dateStr) => {
    if (inactiveQuizzesByDate[dateStr]) {
      setSelectedDate(dateStr);
      setSelectedQuizzes(inactiveQuizzesByDate[dateStr]);
      setShowModal(true);
    }
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
          const count = inactiveCountsByDate[dateStr] || 0;
          const isToday = dateStr === todayDateStr;

          row.push(
            <td
              key={d}
              className={`d_CP_calendar-cell ${count > 0 ? 'd_CP_has-users' : ''} ${isToday ? 'd_today' : ''}`}
              onClick={() => handleCellClick(dateStr)}
              style={{ cursor: count > 0 ? 'pointer' : 'default' }}
            >
              <div className="d_CP_cell-content">
                <div className="d_CP_date">{day}</div>
                {count > 0 && (
                  <div className="d_CP_user-badge">
                    <FaUser className="me-1" />
                    {count}
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
            <p className="text-muted">Click on dates to view inactive quizzes attempted</p>
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

        {/* Modal to show inactive quizzes details for selected date */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Inactive Quizzes on {selectedDate}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedQuizzes.length === 0 ? (
              <p>No inactive quizzes on this date.</p>
            ) : (
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Quiz Title / ID</th>
                    <th>Status</th>
                    <th>Email</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedQuizzes.map((quiz, idx) => (
                    <tr key={quiz._id || idx}>
                      <td>{idx + 1}</td>
                      <td>{quiz.tech_Id?.map(t => t.name).join(', ') || quiz._id || "N/A"}</td>
                      <td>{quiz.status}</td>
                      <td>{quiz.email || 'N/A'}</td>
                      <td>{quiz.score ?? 'N/A'}</td>
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

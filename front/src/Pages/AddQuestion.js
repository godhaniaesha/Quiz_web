import React, { useState } from 'react';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import { FaPlus, FaCheckCircle } from 'react-icons/fa';
import '../style/d_style.css';

const techLanguages = [
    { id: 1, name: 'JavaScript' },
    { id: 2, name: 'Python' },
    { id: 3, name: 'Java' },
    { id: 4, name: 'C#' },
    { id: 5, name: 'React' },
    { id: 6, name: 'Node.js' },
    { id: 7, name: 'CSS' },
    { id: 8, name: 'HTML' },
];

const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
];

export default function AddQuestion() {
    const [form, setForm] = useState({
        question: '',
        options: ['', '', '', ''],
        correct: 0,
        techLang: '',
        difficulty: '',
    });
    const [validated, setValidated] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleOptionChange = (idx, value) => {
        const newOptions = [...form.options];
        newOptions[idx] = value;
        setForm({ ...form, options: newOptions });
    };

    const handleCorrectChange = (idx) => {
        setForm({ ...form, correct: idx });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidated(true);
        if (
            form.question.trim() &&
            form.options.every(opt => opt.trim()) &&
            form.techLang &&
            form.difficulty
        ) {
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 2000);
            setForm({
                question: '',
                options: ['', '', '', ''],
                correct: 0,
                techLang: '',
                difficulty: '',
            });
            setValidated(false);
        }
    };

    return (
        <div className="d_AQ_wrap d-flex justify-content-center align-items-center py-4">
            <div className="d_AQ_card w-100">
                <h2 className="d_AQ_title mb-4 text-center">Add Tech Language Question</h2>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="aqQuestion">
                        <Form.Label>Question</Form.Label>
                        <Form.Control
                            type="text"
                            name="question"
                            value={form.question}
                            onChange={handleChange}
                            required
                            className="d_AQ_input"
                            placeholder="Enter your question"
                        />
                        <Form.Control.Feedback type="invalid">Please enter a question.</Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                        {form.options.map((opt, idx) => (
                            <Col
                                xs={12}
                                sm={6}
                                key={idx}
                                className={`mb-3 ${form.correct === idx ? 'd_correct_option' : ''}`}
                            >
                                <InputGroup>
                                    <InputGroup.Text className="d_AQ_option-label">
                                        {String.fromCharCode(65 + idx)}
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        value={opt}
                                        onChange={e => handleOptionChange(idx, e.target.value)}
                                        required
                                        className="d_AQ_input"
                                        placeholder={`Option ${idx + 1}`}
                                    />
                                    <div className="d_custom_radio ms-2">
                                        <input
                                            type="radio"
                                            name="correctAnswer"
                                            id={`correct-${idx}`}
                                            checked={form.correct === idx}
                                            onChange={() => handleCorrectChange(idx)}
                                        />
                                        <label htmlFor={`correct-${idx}`}>
                                            {form.correct === idx && (
                                                <FaCheckCircle className="d_correct_icon" />
                                            )}
                                        </label>
                                    </div>
                                </InputGroup>
                                <Form.Control.Feedback type="invalid">Please enter option {idx + 1}.</Form.Control.Feedback>
                            </Col>
                        ))}
                    </Row>

                    <Row className="mb-3">
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="aqTechLang">
                                <Form.Label>Tech Language</Form.Label>
                                <Form.Select
                                    name="techLang"
                                    value={form.techLang}
                                    onChange={handleChange}
                                    required
                                    className="d_AQ_input"
                                >
                                    <option value="">Select Tech Language</option>
                                    {techLanguages.map(lang => (
                                        <option key={lang.id} value={lang.id}>{lang.name}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">Please select a tech language.</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="aqDifficulty" className='mt-sm-0 mt-3'>
                                <Form.Label>Difficulty</Form.Label>
                                <Form.Select
                                    name="difficulty"
                                    value={form.difficulty}
                                    onChange={handleChange}
                                    required
                                    className="d_AQ_input"
                                >
                                    <option value="">Select Difficulty</option>
                                    {difficulties.map(diff => (
                                        <option key={diff.value} value={diff.value}>{diff.label}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">Please select a difficulty.</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="text-center mt-4">
                        <Button type="submit" className="d_AQ_btn px-4 py-2" disabled={submitted}>
                            <FaPlus className="me-2" /> Add Question
                        </Button>
                        {submitted && <div className="d_AQ_success mt-3">Question added successfully!</div>}
                    </div>
                </Form>
            </div>
        </div>
    );
}

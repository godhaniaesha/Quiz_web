import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import { FaPlus, FaCheckCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../component/Layout';
import '../style/d_style.css';
import { fetchTechs } from '../redux/slice/tech.slice';
import {
    db_createQuestion,
    db_getQuestionById,
    db_updateQuestion,
} from '../redux/slice/question.slice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddQuestion() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const { techs } = useSelector((state) => state.tech);

    const [form, setForm] = useState({
        question: '',
        options: ['', '', '', ''],
        correct: 0,
        techId: '',
        difficulty: '',
    });
    const [validated, setValidated] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        dispatch(fetchTechs()).then(() => {
            if (isEditMode) {
                dispatch(db_getQuestionById(id)).then((res) => {
                    const q = res.payload;
                    console.log("Fetched question:", q);

                    if (q) {
                        setForm({
                            question: q.Question || '',
                            options: q.options || ['', '', '', ''],
                            correct: 'abcd'.indexOf(q.answer),
                            techId: q.tech_Id?._id || q.tech_Id || '',
                            difficulty: q.difficulty || '',
                        });

                    }
                });
            }
        });
    }, [dispatch, id]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (idx, value) => {
        const opts = [...form.options];
        opts[idx] = value;
        setForm((prev) => ({ ...prev, options: opts }));
    };

    const handleCorrectChange = (idx) => {
        setForm((prev) => ({ ...prev, correct: idx }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidated(true);

        if (
            form.question.trim() &&
            form.options.every((opt) => opt.trim()) &&
            form.techId &&
            form.difficulty
        ) {
            const payload = {
                Question: form.question,
                options: form.options,
                answer: 'abcd'[form.correct],
                tech_Id: form.techId,
                difficulty: form.difficulty,
                active: true,
            };

            try {
                setSubmitting(true);
                const resultAction = isEditMode
                    ? await dispatch(db_updateQuestion({ id, updatedData: payload }))
                    : await dispatch(db_createQuestion(payload));

                if (
                    (isEditMode && db_updateQuestion.fulfilled.match(resultAction)) ||
                    (!isEditMode && db_createQuestion.fulfilled.match(resultAction))
                ) {
                    toast.success(
                        isEditMode
                            ? 'Question updated successfully!'
                            : 'Question added successfully!',
                        { position: 'top-right', autoClose: 2000 }
                    );
                    setTimeout(() => navigate('/Questions'), 2500);
                } else {
                    throw new Error(resultAction.error.message || 'Action failed');
                }
            } catch (error) {
                toast.error(`Error: ${error.message}`, { position: 'top-right' });
            } finally {
                setSubmitting(false);
            }
        }
    };

    return (
        <Layout>
            <ToastContainer />
            <div className="d_AQ_wrap d-flex justify-content-center align-items-center py-4">
                <div className="d_AQ_card w-100">
                    <h2 className="d_AQ_title mb-4 text-center">
                        {isEditMode ? 'Edit' : 'Add'} Tech Language Question
                    </h2>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group controlId="aqQuestion" className="mb-3">
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
                            <Form.Control.Feedback type="invalid">
                                Please enter a question.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row>
                            {form.options.map((opt, idx) => (
                                <Col
                                    xs={12}
                                    sm={6}
                                    key={idx}
                                    className={`mb-3 ${form.correct === idx ? 'd_correct_option' : ''
                                        }`}
                                >
                                    <InputGroup>
                                        <InputGroup.Text className="d_AQ_option-label">
                                            {String.fromCharCode(65 + idx)}
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            value={opt}
                                            onChange={(e) => handleOptionChange(idx, e.target.value)}
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
                                    <Form.Control.Feedback type="invalid">
                                        Please enter option {idx + 1}.
                                    </Form.Control.Feedback>
                                </Col>
                            ))}
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} sm={6}>
                                <Form.Group controlId="aqTechLang">
                                    <Form.Label>Tech Language</Form.Label>
                                    <Form.Select
                                        name="techId"
                                        value={form.techId}
                                        onChange={handleChange}
                                        required
                                        className="d_AQ_input"
                                    >
                                        <option value="">Select Tech Language</option>
                                        {(Array.isArray(techs.result) ? techs.result : techs).map((t) => (
                                            <option key={t._id} value={t._id}>
                                                {t.name}
                                            </option>
                                        ))}

                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Please select a tech language.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={6}>
                                <Form.Group controlId="aqDifficulty" className="mt-sm-0 mt-3">
                                    <Form.Label>Difficulty</Form.Label>
                                    <Form.Select
                                        name="difficulty"
                                        value={form.difficulty}
                                        onChange={handleChange}
                                        required
                                        className="d_AQ_input"
                                    >
                                        <option value="">Select Difficulty</option>
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Please select a difficulty.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="text-center mt-4">
                            <Button type="submit" disabled={submitting} className="d_AQ_btn px-4 py-2">
                                <FaPlus className="me-2" /> {isEditMode ? 'Update' : 'Add'} Question
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </Layout>
    );
}

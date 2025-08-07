import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaUserEdit } from 'react-icons/fa';
import '../style/d_style.css';
import Layout from '../component/Layout';

export default function Profile() {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    role: 'Interviewer',
    bio: 'Experienced interviewer with a strong background in web development and software engineering.',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  return (
    <Layout>
      <Container className="py-5 d_AP_profile_container">
        <Card className="d_AP_profile_card shadow-lg">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={4} className="text-center mb-4 mb-md-0">
                <div className="d_AP_avatar_wrapper">
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/014/194/216/non_2x/avatar-icon-human-a-person-s-badge-social-media-profile-symbol-the-symbol-of-a-person-vector.jpg"
                    alt="Profile"
                    className="d_AP_avatar rounded-circle"
                  />
                  <div className="d_AP_edit_icon" onClick={handleEditToggle}>
                    <FaUserEdit size={20} />
                  </div>
                </div>
              </Col>
              <Col md={8}>
                <h4 className="d_AP_section_title mb-4">Profile Details</h4>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      disabled={!isEditing}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled={!isEditing}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      disabled={!isEditing}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                      type="text"
                      name="role"
                      value={formData.role}
                      disabled={!isEditing}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="bio"
                      value={formData.bio}
                      disabled={!isEditing}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {isEditing && (
                    <div className="d-flex gap-3">
                      <Button variant="primary" className="d_AP_btn_purple" onClick={handleSave}>
                        Save
                      </Button>
                      <Button variant="dark" className="d_AP_btn_dark" onClick={handleEditToggle}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </Form>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
}

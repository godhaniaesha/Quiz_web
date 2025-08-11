import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaUserEdit } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { db_getUserById, db_updateUser } from '../redux/slice/auth.slice';
import Layout from '../component/Layout';
import { toast } from 'react-toastify';
import '../style/d_style.css';

export default function Profile() {
  const dispatch = useDispatch();
  const userId = localStorage.getItem('userId');

  const { user, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    bio: '',
  });

  const [profileImage, setProfileImage] = useState(null); // for file upload
  const [previewImage, setPreviewImage] = useState(''); // preview URL
  const [isEditing, setIsEditing] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (userId) dispatch(db_getUserById(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (user?.data) {
      const data = user.data;
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || data.phone_number || '',
        role: data.role || '',
        bio: data.bio || '',
      });
      setPreviewImage(data.profileImage || '');
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    setValidationError('');
  };

  const validateForm = () => {
    const { name, email, phone, role } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!name || !email || !phone || !role) {
      return 'Please fill in all required fields.';
    }
    if (!emailRegex.test(email)) return 'Invalid email address.';
    if (!phoneRegex.test(phone)) return 'Phone number must be 10 digits.';

    return '';
  };

  const handleSave = () => {
    const validationMsg = validateForm();
    if (validationMsg) {
      setValidationError(validationMsg);
      return;
    }

    const updatedForm = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      updatedForm.append(key, value);
    });

    if (profileImage) {
      updatedForm.append('profileImage', profileImage); // multer field
    }

    setValidationError('');
    dispatch(db_updateUser({ id: userId, updatedData: updatedForm }))
      .unwrap()
      .then(() => {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        setProfileImage(null);
      })
      .catch((err) => {
        toast.error(err?.message || 'Update failed');
      });
  };

  if (!userId) {
    return (
      <Layout>
        <Container className="py-5">
          <Alert variant="danger">Unauthorized. Please login as admin.</Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container className="py-5 d_AP_profile_container">
        <Card className="d_AP_profile_card shadow-lg">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={4} className="text-center mb-4 mb-md-0">
                <div className="d_AP_avatar_wrapper">
                  <img
                    src={
                      previewImage ||
                      'https://static.vecteezy.com/system/resources/previews/014/194/216/non_2x/avatar-icon-human-a-person-s-badge-social-media-profile-symbol-the-symbol-of-a-person-vector.jpg'
                    }
                    alt="Profile"
                    className="d_AP_avatar rounded-circle"
                  />
                  {isEditing && (
                    <Form.Group controlId="profileImage" className="mt-2">
                      <Form.Control type="file" onChange={handleImageChange} accept="image/*" />
                    </Form.Group>
                  )}
                  <div className="d_AP_edit_icon" onClick={handleEditToggle}>
                    <FaUserEdit size={20} />
                  </div>
                </div>
              </Col>

              <Col md={8}>
                <h4 className="d_AP_section_title mb-4">Profile Details</h4>

                {validationError && <Alert variant="danger">{validationError}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                {loading ? (
                  <Spinner animation="border" />
                ) : (
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
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
}

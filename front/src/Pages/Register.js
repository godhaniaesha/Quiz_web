import React, { useState } from 'react';
import '../style/d_style.css';
import Layout from '../component/Layout';

export default function Register() {
  const [selectedTech, setSelectedTech] = useState([]);
  const [searchText, setSearchText] = useState('');

  const techLanguages = [
    'JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'PHP',
    'C#', 'Swift', 'Go', 'Kotlin', 'Rust', 'TypeScript',
    'Scala', 'Perl', 'Dart', 'Haskell', 'Elixir', 'Lua',
    'R', 'Objective-C'
  ];

  const handleCheckboxToggle = (lang) => {
    setSelectedTech(prev =>
      prev.includes(lang)
        ? prev.filter(item => item !== lang)
        : [...prev, lang]
    );
  };

  const handleRemoveSelected = (lang) => {
    setSelectedTech(prev => prev.filter(item => item !== lang));
  };

  const filteredLanguages = techLanguages.filter(lang =>
    lang.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Layout>
      <div className="d_auth_wrap">
        <div className="d_auth_container">
          <div className="d_auth_card">

            <img src={require('../Image/ki3.png')} alt="Logo" className="d_auth_logo" />
            {/* <h2 className="d_auth_title">Create Account</h2> */}
            <form>
              <div className="d_auth_group">
                <label className="d_auth_label">Email</label>
                <input type="email" placeholder="Enter email" className="d_auth_input" />
              </div>

              <div className="d_auth_group mt-3">
                <label className="d_auth_label">Select Tech Languages</label>
                <input
                  type="text"
                  placeholder="Search tech..."
                  className="d_auth_input mb-2"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <div className="d_custom_checkbox_group">
                  {filteredLanguages.map(lang => {
                    const isActive = selectedTech.includes(lang);
                    return (
                      <div
                        key={lang}
                        className={`d_custom_checkbox_box ${isActive ? 'active' : ''}`}
                        onClick={() => handleCheckboxToggle(lang)}
                      >
                        <span className="checkbox-indicator">
                          {isActive ? '✔' : ''}
                        </span>
                        <span>{lang}</span>
                      </div>
                    );
                  })}
                </div>

                {selectedTech.length > 0 && (
                  <div className="d_selected_tech_list mt-3">
                    <label className="d_auth_label">Selected Languages:</label>
                    <div className="d_selected_tags">
                      {selectedTech.map((lang) => (
                        <span className="d_selected_tag" key={lang}>
                          {lang}
                          <button
                            type="button"
                            className="d_remove_btn"
                            onClick={() => handleRemoveSelected(lang)}
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="d_auth_btn mt-4">Register</button>
              <p className="d_auth_footer">
                Already have an account? <a href="/login" className="text-info">Sign In</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </Layout>

  );
}

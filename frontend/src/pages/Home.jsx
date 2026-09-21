import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Home.css";

const Home = () => {
  const rooms = [
    {
      title: "Living Room",
      image:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",
    },
    {
      title: "Bedroom",
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85",
    },
    {
      title: "Kitchen",
      image:
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=85",
    },
    {
      title: "Office",
      image:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85",
    },
  ];

  const styles = [
    {
      title: "Modern",
      text: "Clean lines, elegant furniture and contemporary details.",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
    },
    {
      title: "Luxury",
      text: "Premium materials, sophisticated colors and statement pieces.",
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85",
    },
    {
      title: "Minimal",
      text: "Simple, calm and functional spaces without unnecessary clutter.",
      image:
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=900&q=85",
    },
    {
      title: "Classic",
      text: "Timeless interiors with warm textures and elegant details.",
      image:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85",
    },
  ];

  const features = [
    {
      icon: "✦",
      title: "AI-Powered Design",
      text: "Transform your room photo into a professionally styled interior.",
    },
    {
      icon: "⌂",
      title: "Multiple Room Types",
      text: "Design living rooms, bedrooms, kitchens, offices and more.",
    },
    {
      icon: "◈",
      title: "Multiple Styles",
      text: "Explore Modern, Luxury, Minimal, Classic and other styles.",
    },
    {
      icon: "↓",
      title: "Save & Download",
      text: "Keep your favorite designs and download your final result.",
    },
  ];

  return (
    <main className="home-page">
      <Navbar />

      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-bg" />

        <div className="home-container home-hero-grid">
          <div className="home-hero-content">
            <span className="home-eyebrow">
              ✦ AI POWERED INTERIOR DESIGN
            </span>

            <h1>
              Transform Your Space
              <span> With AI</span>
            </h1>

            <p>
              Upload a photo of your room and let AI create a beautiful,
              personalized interior design in seconds.
            </p>

            <div className="home-hero-actions">
              <Link to="/design" className="home-primary-btn">
                Design My Space
                <span>→</span>
              </Link>

              <a href="#how-it-works" className="home-secondary-btn">
                See How It Works
              </a>
            </div>

            <div className="home-trust">
              <div className="trust-avatars">
                <span>AK</span>
                <span>RS</span>
                <span>MK</span>
                <span>+</span>
              </div>

              <div>
                <strong>AI-powered creativity</strong>
                <small>Turn ideas into beautiful spaces</small>
              </div>
            </div>
          </div>

          <div className="home-hero-visual">
            <div className="hero-image-frame">
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=90"
                alt="Beautiful modern interior"
              />

              <div className="hero-floating-card hero-ai-card">
                <div className="floating-icon">✦</div>
                <div>
                  <strong>AI Design</strong>
                  <span>Creating your space...</span>
                </div>
              </div>

              <div className="hero-floating-card hero-style-card">
                <span className="style-dot" />
                <div>
                  <strong>Modern Style</strong>
                  <span>Personalized for you</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROOMS */}
      <section className="home-section home-rooms">
        <div className="home-container">
          <div className="section-heading">
            <div>
              <span className="section-label">EXPLORE YOUR SPACE</span>
              <h2>Design Any Room</h2>
            </div>

            <p>
              From cozy bedrooms to productive offices, create a space that
              feels uniquely yours.
            </p>
          </div>

          <div className="room-grid">
            {rooms.map((room) => (
              <Link to="/design" className="room-card" key={room.title}>
                <img src={room.image} alt={room.title} />
                <div className="room-overlay">
                  <span>Design</span>
                  <h3>{room.title}</h3>
                  <b>→</b>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="home-section how-section" id="how-it-works">
        <div className="home-container">
          <div className="center-heading">
            <span className="section-label">SIMPLE PROCESS</span>
            <h2>Bring Your Dream Room to Life</h2>
            <p>
              Create your personalized interior in just three simple steps.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">↑</div>
              <h3>Upload Your Room</h3>
              <p>
                Upload a clear photo of your existing room.
              </p>
            </div>

            <div className="step-line" />

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">✦</div>
              <h3>Choose Your Style</h3>
              <p>
                Select your room type and preferred interior style.
              </p>
            </div>

            <div className="step-line" />

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">◇</div>
              <h3>Generate Design</h3>
              <p>
                Let AI transform your room into a stunning new space.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STYLES */}
      <section className="home-section style-section">
        <div className="home-container">
          <div className="section-heading">
            <div>
              <span className="section-label">FIND YOUR STYLE</span>
              <h2>Inspired by Your Taste</h2>
            </div>

            <p>
              Choose the aesthetic that matches your personality and lifestyle.
            </p>
          </div>

          <div className="style-grid">
            {styles.map((style) => (
              <Link to="/design" className="style-card" key={style.title}>
                <img src={style.image} alt={style.title} />

                <div className="style-content">
                  <span>INTERIOR STYLE</span>
                  <h3>{style.title}</h3>
                  <p>{style.text}</p>
                  <b>Explore →</b>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES
      <section className="home-section features-section">
        <div className="home-container">
          <div className="features-layout">
            <div className="features-intro">
              <span className="section-label">POWERFUL FEATURES</span>

              <h2>
                Everything You Need to
                <span> Design Better</span>
              </h2>

              <p>
                ProjectDecoration combines AI technology with interior design
                to help you visualize beautiful spaces before making changes.
              </p>

              <Link to="/design" className="home-primary-btn">
                Start Designing <span>→</span>
              </Link>
            </div>

            <div className="features-grid">
              {features.map((feature) => (
                <div className="feature-card" key={feature.title}>
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* SHOWCASE */}
      <section className="home-section showcase-section">
        <div className="home-container">
          <div className="center-heading">
            <span className="section-label">AI TRANSFORMATION</span>
            <h2>See the Possibilities</h2>
            <p>
              Imagine what your existing space could become.
            </p>
          </div>

          <div className="showcase-grid">
            <div className="showcase-card">
              <img
                src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=90"
                alt="Interior design before transformation"
              />
              <span>BEFORE</span>
            </div>

            <div className="showcase-arrow">→</div>

            <div className="showcase-card">
              <img
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=90"
                alt="Interior design after transformation"
              />
              <span>AI DESIGN</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div className="home-container">
          <div className="cta-inner">
            <div>
              <span className="section-label">YOUR SPACE. YOUR STYLE.</span>

              <h2>
                Ready to Design
                <br />
                Your Dream Space?
              </h2>

              <p>
                Upload your room and discover what's possible with AI.
              </p>
            </div>

            <Link to="/design" className="cta-button">
              Start Designing
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Home;
const About = () => (
  <div className="max-w-3xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl">
    <h1 className="text-3xl font-semibold mb-4 text-white">
      About This App
    </h1>

    <p className="text-gray-300 leading-relaxed">
      This is a real-time chat application built using
      <b> React, Spring Boot, WebSockets, MongoDB</b>.
      It supports secure session-based authentication,
      live messaging, and room-based conversations.
    </p>
  </div>
);

export default About;

const TeamMember = ({ name, role, image, socials }) => {
  return (
    <div className="bg-[#161a2c]/30 backdrop-blur-md rounded-lg p-6 border border-white/10 text-center text-white">
      <img
        src={image}
        alt={name}
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="text-gray-300">{role}</p>
      <div className="flex justify-center gap-4 mt-4">
        <a
          href={socials.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#38b2c8] hover:underline"
        >
          Twitter
        </a>
        <a
          href={socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#38b2c8] hover:underline"
        >
          Instagram
        </a>
      </div>
    </div>
  );
};

export default TeamMember;

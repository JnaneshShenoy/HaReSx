function SkillList({ src, skill }) {
  return (
    <span>
      <p>{skill}</p>
      <img src={src} alt="Checkmark icon" />
    </span>
  );
}

export default SkillList;

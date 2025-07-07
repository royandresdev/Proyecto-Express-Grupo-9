const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`; // Tonos vibrantes
  return color;
};

const InitialsAvatar = ({
  name = '',
  size = 64,
  textColor = '#fff',
  fontSize = 14,
  fontWeight = '600',
  fontFamily = 'Inter, sans-serif',
  className = '',
}) => {
  const initials = getInitials(name);
  const backgroundColor = stringToColor(name);

  return (
    <div
      className={`flex items-center justify-center select-none ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor,
        color: textColor,
        fontSize,
        fontWeight,
        fontFamily,
      }}
    >
      {initials}
    </div>
  )
};

export default InitialsAvatar;

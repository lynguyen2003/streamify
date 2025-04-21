type LoaderProps = {
  size?: 'small' | 'medium' | 'large';
};

const Loader = ({ size = 'medium' }: LoaderProps) => {
  const dimensions = {
    small: 16,
    medium: 24,
    large: 32
  };

  const width = dimensions[size];
  
  return (
    <div className="flex-center w-full">
      <img
        src="/assets/icons/loader.svg"
        alt="loader"
        width={width}
        height={width}
        className="animate-spin"
      />
    </div>
  );
};

export default Loader;

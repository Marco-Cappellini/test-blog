import Button from '@mui/material/Button';

export default function ShowPasswordButton({ show, setShow, disabled }) {
  return (
    <Button
      onClick={() => setShow(prev => !prev)}
      variant="text"
      size="small"
      disabled={disabled}
    >
      {show ? 'Hide' : 'Show'}
    </Button>
  );
}
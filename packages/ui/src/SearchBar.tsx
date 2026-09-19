import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search GitHub repositories…' }: SearchBarProps) {
  return (
    <TextField
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
          fontSize: '1rem',
          boxShadow: '0 2px 8px rgba(0,204,204,0.08)',
          '&.Mui-focused': {
            boxShadow: '0 4px 16px rgba(0,204,204,0.18)',
          },
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'primary.main' }} />
            </InputAdornment>
          ),
          sx: { py: 0.5 },
        },
      }}
    />
  );
}

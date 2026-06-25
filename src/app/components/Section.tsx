import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface SectionProps {
  title: string;
  children: ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <Box component="section" sx={{ mt: { xs: 5, sm: 7 } }}>
      <Typography
        component="h2"
        sx={{
          fontSize: '1rem',
          fontWeight: 400,
          color: 'text.secondary',
          mb: 3,
        }}
      >
        {title}
      </Typography>
      <Stack spacing={{ xs: 4.5, sm: 5 }}>{children}</Stack>
    </Box>
  );
}

import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface SectionProps {
  title: string;
  children: ReactNode;
}

export function Section({ title, children }: SectionProps) {
  // data-section feeds PostHog section_viewed (src/analytics.ts).
  return (
    <Box component="section" data-section={title} sx={{ mt: { xs: 5, sm: 7 } }}>
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

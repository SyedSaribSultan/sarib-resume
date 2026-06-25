import { Box, Chip, Link, Stack, Typography } from '@mui/material';
import { ArrowUpRight } from 'lucide-react';
import type { ResumeEntry } from './resume-data';

interface EntryRowProps {
  entry: ResumeEntry;
}

export function EntryRow({ entry }: EntryRowProps) {
  const titleNode = (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
      {entry.href ? (
        <Link
          href={entry.href}
          target="_blank"
          rel="noopener"
          underline="hover"
          color="text.primary"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.25,
            fontWeight: 500,
            '&:hover svg': { transform: 'translate(1px, -1px)' },
          }}
        >
          {entry.title}
          <ArrowUpRight size={15} style={{ transition: 'transform 120ms ease' }} />
        </Link>
      ) : (
        <Typography component="span" sx={{ fontWeight: 500 }}>
          {entry.title}
        </Typography>
      )}
      {entry.tag && (
        <Chip
          label={entry.tag}
          size="small"
          variant="outlined"
          sx={{ height: 26, fontSize: '1rem', letterSpacing: '0.04em' }}
        />
      )}
    </Stack>
  );

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '140px 1fr' },
        columnGap: 4,
        rowGap: 0.5,
        alignItems: 'baseline',
      }}
    >
      <Typography
        sx={{
          fontSize: '1rem',
          color: 'text.disabled',
          pt: { sm: 0.25 },
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {entry.period}
      </Typography>

      <Box sx={{ minWidth: 0 }}>
        {titleNode}

        {(entry.subtitle || entry.meta) && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', color: 'text.secondary', fontSize: '1rem', mt: 0.25, flexWrap: 'wrap' }}
          >
            {entry.subtitle && <Typography component="span" sx={{ fontSize: 'inherit' }}>{entry.subtitle}</Typography>}
            {entry.subtitle && entry.meta && <Typography component="span" sx={{ fontSize: 'inherit' }}>·</Typography>}
            {entry.meta && <Typography component="span" sx={{ fontSize: 'inherit' }}>{entry.meta}</Typography>}
          </Stack>
        )}

        {entry.description && (
          <Typography sx={{ fontSize: '1rem', color: 'text.secondary', mt: 1, lineHeight: 1.6 }}>
            {entry.description}
          </Typography>
        )}

        {entry.bullets && (
          <Stack component="ul" spacing={0.75} sx={{ m: 0, mt: 1.25, pl: 0, listStyle: 'none' }}>
            {entry.bullets.map((b) => (
              <Box
                component="li"
                key={b}
                sx={{ fontSize: '1rem', color: 'text.secondary', lineHeight: 1.6, pl: 2, position: 'relative' }}
              >
                <Box
                  component="span"
                  sx={{ position: 'absolute', left: 0, top: '0.65em', width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }}
                />
                {b}
              </Box>
            ))}
          </Stack>
        )}

        {/* Roles — sub-positions within one company, shown as a dot + connector
            line timeline (newest first), mirroring the LinkedIn pattern. */}
        {entry.roles && (
          <Stack sx={{ mt: 2 }}>
            {entry.roles.map((r, i) => {
              const isLast = i === entry.roles!.length - 1;
              return (
                <Box
                  key={r.label}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '7px 1fr',
                    columnGap: 1.5,
                    pb: isLast ? 0 : 2,
                  }}
                >
                  {/* Dot + connector line. */}
                  <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        bgcolor: 'text.primary',
                        mt: '6px',
                        zIndex: 1,
                      }}
                    />
                    {!isLast && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '6px',
                          bottom: -22,
                          width: '1.5px',
                          bgcolor: 'divider',
                        }}
                      />
                    )}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: 'text.primary', lineHeight: 1.4 }}>
                      {r.label}
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', color: 'text.secondary', lineHeight: 1.4 }}>
                      {r.text}
                    </Typography>
                    {r.description && (
                      <Typography sx={{ fontSize: '1rem', color: 'text.secondary', lineHeight: 1.6, mt: 0.75 }}>
                        {r.description}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Stack>
        )}

        {entry.sections && (
          <Stack spacing={{ xs: 1.75, sm: 2 }} sx={{ mt: 2 }}>
            {entry.sections.map((s) => (
              <Box key={s.label}>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: 'text.primary',
                    lineHeight: 1.4,
                    mb: 0.25,
                  }}
                >
                  {s.label}
                </Typography>
                <Typography sx={{ fontSize: '1rem', color: 'text.secondary', lineHeight: 1.6 }}>
                  {s.text}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}

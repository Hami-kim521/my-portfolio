import { useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Fade,
  FormControlLabel,
  Paper,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Paragraphs from './paragraphs.jsx'
import { colors } from '../../theme.js'

/** 홈 탭에도 표시되는 섹션에 붙는 작은 라벨 */
function HomeBadge({ show }) {
  if (!show) return null
  return <Chip label="홈 표시" size="small" variant="outlined" sx={ { ml: 1, height: 20, fontSize: 11, borderRadius: 0 } } />
}

/**
 * 섹션 본문. 평소엔 글만 보여주고, "수정"을 누르면 입력창으로 바뀝니다.
 * 입력할 때마다 Context 가 갱신되므로 홈 탭에 바로 반영됩니다.
 *
 * @param {{ id: string, title: string, content: string, showInHome: boolean }} section - 섹션 [Required]
 * @param {Function} onUpdate - (id, patch) => void [Required]
 */
function SectionBody({ section, onUpdate }) {
  const { id, title, content, showInHome } = section
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Box>
      {/* key 가 바뀔 때마다 새로 마운트되어 부드럽게 나타납니다 */}
      <Fade in appear timeout={ 250 } key={ isEditing ? 'edit' : 'view' }>
        <Box>
          { isEditing ? (
            <TextField
              value={ content }
              onChange={ (event) => onUpdate(id, { content: event.target.value }) }
              label={ `${title} 내용` }
              helperText="Enter 로 줄을 나누면 문단이 나뉘어 홈 탭에도 그대로 보여요."
              multiline
              minRows={ 3 }
              fullWidth
              autoFocus
            />
          ) : (
            <Paragraphs
              text={ content.trim() ? content : '내용이 없습니다. "수정"을 눌러 작성해 보세요.' }
              gap={ 2 }
              sx={ { color: colors.textSecondary, lineHeight: 1.7, fontSize: 17 } }
            />
          ) }
        </Box>
      </Fade>
      <Box sx={ { mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 } }>
        <FormControlLabel
          control={ <Switch size="small" checked={ showInHome } onChange={ (event) => onUpdate(id, { showInHome: event.target.checked }) } /> }
          label="홈 탭에 표시"
        />
        <Button size="small" variant={ isEditing ? 'contained' : 'outlined' } color="primary" onClick={ () => setIsEditing((prev) => !prev) }>
          { isEditing ? '완료' : '수정' }
        </Button>
      </Box>
    </Box>
  )
}

/**
 * About Me 콘텐츠 섹션 목록.
 * 넓은 화면(md 이상)에서는 탭, 좁은 화면에서는 아코디언으로 보여줍니다.
 *
 * @param {Array<{ id: string, title: string, content: string, showInHome: boolean }>} sections - 콘텐츠 섹션 [Required]
 * @param {Function} onUpdateSection - (id, patch) => void. 내용·홈 표시 여부를 바꿀 때 호출 [Required]
 *
 * Example usage:
 * <AboutSections sections={ aboutMeData.sections } onUpdateSection={ updateSection } />
 */
export default function AboutSections({ sections, onUpdateSection }) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const [activeId, setActiveId] = useState(sections[0]?.id)

  if (sections.length === 0) return null

  // 아코디언: 하나만 열리고, 같은 항목을 다시 누르면 닫힘
  if (!isDesktop) {
    return (
      <Box>
        { sections.map((section) => {
          const { id, title, showInHome } = section
          return (
            <Accordion
              key={ id }
              expanded={ activeId === id }
              onChange={ (_, isOpen) => setActiveId(isOpen ? id : false) }
              disableGutters
              elevation={ 0 }
              sx={ {
                border: `1px solid ${colors.border}`,
                '&:not(:last-child)': { mb: 1.5 },
                '&::before': { display: 'none' },
                borderRadius: 0,
                overflow: 'hidden',
              } }
            >
              <AccordionSummary expandIcon={ <ExpandMoreIcon /> } aria-controls={ `${id}-content` } id={ `${id}-header` }>
                <Typography sx={ { fontWeight: 700 } }>{ title }</Typography>
                <HomeBadge show={ showInHome } />
              </AccordionSummary>
              <AccordionDetails id={ `${id}-content` }>
                <SectionBody section={ section } onUpdate={ onUpdateSection } />
              </AccordionDetails>
            </Accordion>
          )
        }) }
      </Box>
    )
  }

  // 탭
  const activeSection = sections.find(({ id }) => id === activeId) ?? sections[0]

  return (
    <Paper elevation={ 0 } sx={ { border: `1px solid ${colors.border}`, borderRadius: 0, overflow: 'hidden' } }>
      <Tabs
        value={ activeSection.id }
        onChange={ (_, value) => setActiveId(value) }
        variant="fullWidth"
        aria-label="About Me 콘텐츠 탭"
        sx={ {
          borderBottom: `1px solid ${colors.border}`,
          '& .MuiTabs-indicator': { backgroundColor: colors.accent },
          '& .Mui-selected': { color: `${colors.primaryDark} !important` },
        } }
      >
        { sections.map(({ id, title, showInHome }) => (
          <Tab
            key={ id }
            value={ id }
            id={ `${id}-tab` }
            aria-controls={ `${id}-panel` }
            label={
              <Box sx={ { display: 'flex', alignItems: 'center' } }>
                <Box component="span" sx={ { fontWeight: 700 } }>{ title }</Box>
                <HomeBadge show={ showInHome } />
              </Box>
            }
            sx={ { textTransform: 'none', py: 2 } }
          />
        )) }
      </Tabs>
      <Box
        role="tabpanel"
        id={ `${activeSection.id}-panel` }
        aria-labelledby={ `${activeSection.id}-tab` }
        sx={ { p: 5, minHeight: 160 } }
      >
        <Typography variant="h6" component="h2" sx={ { mb: 2, fontWeight: 700 } }>
          { activeSection.title }
        </Typography>
        <SectionBody key={ activeSection.id } section={ activeSection } onUpdate={ onUpdateSection } />
      </Box>
    </Paper>
  )
}

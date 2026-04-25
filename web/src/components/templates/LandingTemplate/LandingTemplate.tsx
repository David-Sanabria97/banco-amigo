import NavBar from '@/components/organisms/NavBar'
import DraftBanner from '@/components/molecules/DraftBanner'
import HeroSection from '@/components/organisms/HeroSection'
import StatsBar from '@/components/organisms/StatsBar'
import HowItWorksSection from '@/components/organisms/HowItWorksSection'
import RequirementsSection from '@/components/organisms/RequirementsSection'
import CtaBanner from '@/components/organisms/CtaBanner'
import MetricsBar from '@/components/organisms/MetricsBar'
import styles from './LandingTemplate.module.scss'

export default function LandingTemplate() {
  return (
    <div className={styles.page}>
      <NavBar />
      <DraftBanner />
      <HeroSection />
      <StatsBar />
      <div className={styles.twoCol}>
        <HowItWorksSection />
        <RequirementsSection />
      </div>
      <CtaBanner />
      <MetricsBar />
    </div>
  )
}

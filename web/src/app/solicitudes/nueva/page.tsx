'use client'

import { useEffect, useRef } from 'react'
import { useAppSelector } from '@/store/hooks'
import ApplicationFlowTemplate from '@/components/templates/ApplicationFlowTemplate'
import BasicDataForm from '@/components/organisms/BasicDataForm'
import FinancialDataForm from '@/components/organisms/FinancialDataForm'
import OfferSimulation from '@/components/organisms/OfferSimulation'
import ApplicationSummary from '@/components/organisms/ApplicationSummary'

export default function NuevaSolicitudPage() {
  const currentStep = useAppSelector((state) => state.solicitud.currentStep)
  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    topRef.current?.focus()
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentStep])

  return (
    <ApplicationFlowTemplate>
      <div ref={topRef} tabIndex={-1} style={{ outline: 'none' }}>
        {currentStep === 1 && <BasicDataForm />}
        {currentStep === 2 && <FinancialDataForm />}
        {currentStep === 3 && <OfferSimulation />}
        {currentStep === 4 && <ApplicationSummary />}
      </div>
    </ApplicationFlowTemplate>
  )
}

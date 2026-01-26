// lib/visaQuestionBank.ts
export type VisaOption = { value: string; label: string; score: number; why: string };
export type VisaQuestion = {
  id: string;
  section: string;
  label: string;
  type: "single";
  required: true;
  options: VisaOption[];
};

function q(id: string, section: string, label: string, options: VisaOption[]): VisaQuestion {
  return { id, section, label, type: "single", required: true, options };
}

function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * “Familia” para evitar repetición de temas (si ya salió una, no sale otra del mismo tipo).
 * Ej: emp_tenure -> emp_tenure
 * travel_prev_visas -> travel_prev_visas
 */
function familyKey(id: string) {
  // Si el id tiene sufijo _01, _02, etc, lo removemos
  return id.replace(/_\d+$/, "");
}

/**
 * Selector balanceado por secciones + evita repetir familias.
 */
export function pickQuestions(bank: VisaQuestion[], total = 25) {
  const perSection: Record<string, number> = {
    Identidad: 3,
    Arraigo: 5,
    Empleo: 6,
    Finanzas: 3,
    Viajes: 4,
    EEUU: 2,
    Coherencia: 2
  };

  const bySection: Record<string, VisaQuestion[]> = {};
  for (const item of bank) {
    bySection[item.section] = bySection[item.section] || [];
    bySection[item.section].push(item);
  }

  const selected: VisaQuestion[] = [];
  const usedFamilies = new Set<string>();

  for (const [section, n] of Object.entries(perSection)) {
    const pool = (bySection[section] || []).slice();
    shuffle(pool);

    for (const item of pool) {
      if (selected.filter(x => x.section === section).length >= n) break;
      const fk = familyKey(item.id);
      if (usedFamilies.has(fk)) continue;
      selected.push(item);
      usedFamilies.add(fk);
    }
  }

  // Completa si falta
  if (selected.length < total) {
    const all = bank.slice();
    shuffle(all);
    for (const item of all) {
      if (selected.length >= total) break;
      const fk = familyKey(item.id);
      if (usedFamilies.has(fk)) continue;
      selected.push(item);
      usedFamilies.add(fk);
    }
  }

  shuffle(selected);
  return selected.slice(0, total);
}

/** === Sets de opciones reutilizables === */
const OPT = {
  yesNoPlus: (whyYes: string, whyNo = "Neutral"): VisaOption[] => [
    { value: "yes", label: "Sí", score: 6, why: whyYes },
    { value: "no", label: "No", score: 0, why: whyNo }
  ],
  yesNoSmallPlus: (whyYes: string): VisaOption[] => [
    { value: "yes", label: "Sí", score: 3, why: whyYes },
    { value: "no", label: "No", score: 0, why: "Neutral" }
  ],
  yesNoRisk: (whyYesRisk: string): VisaOption[] => [
    { value: "no", label: "No", score: 5, why: "Cumplimiento / menor riesgo" },
    { value: "yes", label: "Sí", score: -15, why: whyYesRisk }
  ],
  yesNoCritical: (whyYesRisk: string): VisaOption[] => [
    { value: "no", label: "No", score: 3, why: "Neutral/positivo" },
    { value: "yes", label: "Sí", score: -25, why: whyYesRisk }
  ],
  ageRange: (): VisaOption[] => [
    { value: "18_22", label: "18–22", score: 2, why: "Arraigo promedio menor" },
    { value: "23_30", label: "23–30", score: 5, why: "Arraigo en construcción" },
    { value: "31_45", label: "31–45", score: 10, why: "Mayor estabilidad promedio" },
    { value: "46_60", label: "46–60", score: 8, why: "Arraigo alto" },
    { value: "60_plus", label: "60+", score: 5, why: "Depende de solvencia" }
  ],
  marital: (): VisaOption[] => [
    { value: "married", label: "Casado/a", score: 6, why: "Arraigo familiar" },
    { value: "stable_union", label: "Unión estable", score: 5, why: "Arraigo familiar" },
    { value: "single", label: "Soltero/a", score: 2, why: "Menos ataduras formales" },
    { value: "divorced", label: "Divorciado/a", score: 4, why: "Arraigo posible" }
  ],
  edu: (): VisaOption[] => [
    { value: "basic", label: "Básica", score: 1, why: "Neutral" },
    { value: "highschool", label: "Bachillerato", score: 3, why: "Neutral/positivo" },
    { value: "tech", label: "Técnico/tecnólogo", score: 5, why: "Mayor estabilidad posible" },
    { value: "uni", label: "Universitario", score: 7, why: "Mayor estabilidad posible" },
    { value: "post", label: "Posgrado", score: 8, why: "Estabilidad profesional" }
  ],
  tenure: (): VisaOption[] => [
    { value: "lt_6m", label: "< 6 meses", score: 0, why: "Inestabilidad reciente" },
    { value: "6_12m", label: "6–12 meses", score: 2, why: "Estabilidad baja" },
    { value: "1_3y", label: "1–3 años", score: 5, why: "Estabilidad moderada" },
    { value: "gt_3y", label: "+3 años", score: 8, why: "Estabilidad alta" }
  ],
  employment: (): VisaOption[] => [
    { value: "formal_employee", label: "Empleado formal", score: 10, why: "Ingreso verificable" },
    { value: "formal_business", label: "Negocio formal", score: 8, why: "Arraigo por negocio" },
    { value: "informal", label: "Independiente informal", score: 4, why: "Menos verificable" },
    { value: "unemployed", label: "Desempleado", score: 0, why: "Riesgo mayor" }
  ],
  incomeProof: (): VisaOption[] => [
    { value: "yes", label: "Sí", score: 6, why: "Verificabilidad" },
    { value: "partial", label: "Parcial", score: 3, why: "Verificabilidad parcial" },
    { value: "no", label: "No", score: 0, why: "Difícil sustentar" }
  ],
  tripDuration: (): VisaOption[] => [
    { value: "1_7", label: "1–7 días", score: 6, why: "Duración razonable" },
    { value: "8_15", label: "8–15 días", score: 6, why: "Duración razonable" },
    { value: "16_30", label: "16–30 días", score: 3, why: "Requiere coherencia con empleo" },
    { value: "31_plus", label: "+31 días", score: -6, why: "Duración puede generar dudas" }
  ],
  budget: (): VisaOption[] => [
    { value: "low_unclear", label: "Bajo / no claro", score: -6, why: "Coherencia financiera débil" },
    { value: "mid", label: "Medio", score: 3, why: "Coherencia posible" },
    { value: "high", label: "Alto y demostrable", score: 7, why: "Solvencia" }
  ],
  sponsor: (): VisaOption[] => [
    { value: "self", label: "Yo pago todo", score: 6, why: "Autonomía financiera" },
    { value: "mix", label: "Mitad yo / mitad otro", score: 2, why: "Depende de sustento" },
    { value: "other", label: "Otro paga casi todo", score: -3, why: "Puede generar dependencia" }
  ],
  consistency: (): VisaOption[] => [
    { value: "clear", label: "Muy claro", score: 10, why: "Coherencia alta" },
    { value: "somewhat", label: "Más o menos claro", score: 3, why: "Coherencia parcial" },
    { value: "unclear", label: "No está claro", score: -10, why: "Riesgo por falta de claridad" }
  ],
  returnPlan: (): VisaOption[] => [
    { value: "date_and_obligation", label: "Fecha + obligación clara", score: 10, why: "Arraigo/coherencia" },
    { value: "date_only", label: "Solo fecha", score: 4, why: "Coherencia parcial" },
    { value: "unclear", label: "No está claro", score: -10, why: "Riesgo por falta de plan" }
  ],
  usIntent: (): VisaOption[] => [
    { value: "no", label: "No", score: 5, why: "Consistente con B1/B2" },
    { value: "unsure", label: "No estoy seguro", score: -5, why: "Ambigüedad" },
    { value: "yes", label: "Sí", score: -30, why: "No corresponde a B1/B2" }
  ],
  visaDenial: (): VisaOption[] => [
    { value: "never", label: "Nunca", score: 5, why: "Sin historial negativo" },
    { value: "yes_explained", label: "Sí, y lo puedo explicar", score: 1, why: "Depende del caso" },
    { value: "yes_unclear", label: "Sí, pero no lo tengo claro", score: -8, why: "Inconsistencia" }
  ],
  travelCount: (): VisaOption[] => [
    { value: "0", label: "0", score: 0, why: "Neutral" },
    { value: "1_2", label: "1–2", score: 2, why: "Algo de historial" },
    { value: "3_5", label: "3–5", score: 5, why: "Buen historial" },
    { value: "6_plus", label: "6+", score: 7, why: "Historial sólido" }
  ]
};

/**
 * ✅ BANCO DE 200 PREGUNTAS (sin “variación”)
 */
export function buildQuestionBank(): VisaQuestion[] {
  const bank: VisaQuestion[] = [];

  // =========================
  // IDENTIDAD (20)
  // =========================
  bank.push(
    q("id_age_range", "Identidad", "Rango de edad", OPT.ageRange()),
    q("id_marital_status", "Identidad", "Estado civil", OPT.marital()),
    q("id_dependents", "Identidad", "¿Tienes hijos o dependientes directos en Ecuador?", OPT.yesNoPlus("Arraigo familiar")),
    q("id_education_level", "Identidad", "Nivel de estudios alcanzado", OPT.edu()),
    q("id_current_study", "Identidad", "¿Estás estudiando actualmente?", OPT.yesNoSmallPlus("Vínculo académico")),
    q("id_live_with_family", "Identidad", "¿Vives con familia directa en Ecuador?", OPT.yesNoSmallPlus("Red de apoyo y arraigo")),
    q("id_home_address_stability", "Identidad", "¿Has vivido en la misma ciudad los últimos 2 años?", OPT.yesNoSmallPlus("Estabilidad residencial")),
    q("id_responsibilities", "Identidad", "¿Tienes responsabilidades fijas (familia, salud, cuidado)?", OPT.yesNoSmallPlus("Costo de no regresar")),
    q("id_passport_validity", "Identidad", "¿Tu pasaporte tiene vigencia mayor a 6 meses?", OPT.yesNoSmallPlus("Preparación básica")),
    q("id_travel_companions", "Identidad", "¿Viajarás solo/a o acompañado/a?", [
      { value: "alone", label: "Solo/a", score: 2, why: "Neutral" },
      { value: "family", label: "Con familia", score: 4, why: "Coherencia frecuente" },
      { value: "friends", label: "Con amigos", score: 2, why: "Neutral" }
    ]),
    q("id_language", "Identidad", "Nivel de inglés", [
      { value: "none", label: "Nulo/Básico", score: 0, why: "Neutral" },
      { value: "mid", label: "Intermedio", score: 2, why: "Mejor preparación" },
      { value: "high", label: "Avanzado", score: 3, why: "Mejor preparación" }
    ]),
    q("id_social_media_consistency", "Identidad", "¿Tu actividad pública en redes es coherente con tu perfil (empleo/estudios)?", OPT.yesNoSmallPlus("Coherencia general")),
    q("id_name_matches_docs", "Identidad", "¿Tus nombres y apellidos coinciden igual en todos los documentos?", OPT.yesNoSmallPlus("Evita inconsistencias")),
    q("id_prior_names", "Identidad", "¿Has cambiado de nombre/apellidos legalmente?", [
      { value: "no", label: "No", score: 1, why: "Neutral" },
      { value: "yes_documented", label: "Sí, con respaldo legal", score: 1, why: "Debe estar documentado" },
      { value: "yes_unclear", label: "Sí, pero no tengo respaldo", score: -8, why: "Inconsistencia documental" }
    ]),
    q("id_children_travel", "Identidad", "Si tienes hijos, ¿se quedan en Ecuador mientras viajas?", [
      { value: "na", label: "No aplica", score: 0, why: "Neutral" },
      { value: "yes", label: "Sí, se quedan", score: 6, why: "Arraigo fuerte" },
      { value: "no", label: "No, viajan conmigo", score: 1, why: "Neutral" }
    ]),
    q("id_health_insurance", "Identidad", "¿Tienes seguro de viaje o plan de salud para tu estadía?", OPT.yesNoSmallPlus("Preparación")),
    q("id_document_order", "Identidad", "¿Tienes todos tus documentos personales en orden (civil, identidad, etc.)?", OPT.yesNoSmallPlus("Preparación")),
    q("id_debt_disclosure", "Identidad", "¿Tus obligaciones financieras son manejables (sin mora grave)?", [
      { value: "yes", label: "Sí", score: 3, why: "Estabilidad" },
      { value: "some", label: "Algunas dificultades", score: 0, why: "Neutral" },
      { value: "no", label: "Mora grave", score: -8, why: "Riesgo financiero" }
    ]),
    q("id_time_in_ecuador", "Identidad", "¿Has vivido continuamente en Ecuador los últimos 3 años?", OPT.yesNoSmallPlus("Estabilidad"))
  );

  // =========================
  // ARRAIGO (45)
  // =========================
  bank.push(
    q("arr_property_house", "Arraigo", "¿Tienes casa o departamento a tu nombre?", OPT.yesNoPlus("Arraigo patrimonial")),
    q("arr_property_land", "Arraigo", "¿Tienes terreno a tu nombre?", OPT.yesNoPlus("Arraigo patrimonial")),
    q("arr_vehicle", "Arraigo", "¿Tienes vehículo a tu nombre?", OPT.yesNoSmallPlus("Arraigo patrimonial")),
    q("arr_rental_contract", "Arraigo", "¿Tienes contrato de arriendo a tu nombre?", OPT.yesNoSmallPlus("Estabilidad residencial")),
    q("arr_family_in_ecuador", "Arraigo", "¿Tu familia directa vive en Ecuador?", OPT.yesNoPlus("Arraigo familiar")),
    q("arr_care_elderly", "Arraigo", "¿Cuidas a un familiar (niños/ancianos) en Ecuador?", OPT.yesNoPlus("Responsabilidad")),
    q("arr_school_children", "Arraigo", "¿Tus hijos están matriculados en Ecuador?", OPT.yesNoPlus("Arraigo escolar")),
    q("arr_spouse_in_ecuador", "Arraigo", "¿Tu pareja se queda en Ecuador mientras viajas?", OPT.yesNoPlus("Costo de no regresar")),
    q("arr_long_term_commitments", "Arraigo", "¿Tienes compromisos próximos (graduación, eventos familiares, trabajo)?", OPT.yesNoSmallPlus("Coherencia temporal")),
    q("arr_local_membership", "Arraigo", "¿Perteneces a gremios/clubes/organizaciones en Ecuador?", OPT.yesNoSmallPlus("Red social")),
    q("arr_bank_account", "Arraigo", "¿Tienes cuenta bancaria activa con movimientos regulares?", OPT.yesNoSmallPlus("Formalidad")),
    q("arr_credit_history", "Arraigo", "¿Tienes historial crediticio positivo?", OPT.yesNoSmallPlus("Estabilidad")),
    q("arr_active_loans", "Arraigo", "¿Tienes préstamos activos (hipoteca/auto) al día?", OPT.yesNoSmallPlus("Compromiso financiero")),
    q("arr_business_assets", "Arraigo", "¿Tu negocio tiene activos/equipos en Ecuador?", OPT.yesNoPlus("Arraigo por negocio")),
    q("arr_employees", "Arraigo", "¿Tienes empleados en Ecuador?", OPT.yesNoPlus("Arraigo fuerte por negocio")),
    q("arr_tax_compliance", "Arraigo", "¿Estás al día en obligaciones tributarias (si aplica)?", OPT.yesNoSmallPlus("Formalidad")),
    q("arr_study_enrollment", "Arraigo", "¿Estás matriculado/a en un programa académico próximo?", OPT.yesNoPlus("Vínculo académico")),
    q("arr_property_shared", "Arraigo", "¿Tienes bienes compartidos (sociedad conyugal/copropiedad)?", OPT.yesNoSmallPlus("Arraigo patrimonial")),
    q("arr_savings_goal_ecuador", "Arraigo", "¿Tienes metas financieras en Ecuador (compra/negocio)?", OPT.yesNoSmallPlus("Intención de retorno")),
    q("arr_local_projects", "Arraigo", "¿Tienes proyectos locales en ejecución (obra/negocio/estudio)?", OPT.yesNoSmallPlus("Coherencia")),
    q("arr_work_contract", "Arraigo", "¿Tu trabajo tiene contrato/roles de pago comprobables?", OPT.yesNoPlus("Verificabilidad")),
    q("arr_university_schedule", "Arraigo", "¿Tienes calendario académico que te obliga a volver?", OPT.yesNoPlus("Retorno")),
    q("arr_family_events", "Arraigo", "¿Tienes eventos familiares cercanos que te hagan volver?", OPT.yesNoSmallPlus("Retorno")),
    q("arr_medical_followup", "Arraigo", "¿Tienes tratamientos o controles médicos en Ecuador?", OPT.yesNoSmallPlus("Retorno")),
    q("arr_custody", "Arraigo", "¿Tienes custodia/obligaciones legales en Ecuador?", OPT.yesNoPlus("Retorno")),
    q("arr_future_job_start", "Arraigo", "¿Tienes un inicio de trabajo próximo en Ecuador?", OPT.yesNoPlus("Retorno")),
    q("arr_property_documents_ready", "Arraigo", "¿Puedes demostrar tus bienes con documentos?", OPT.yesNoPlus("Verificabilidad")),
    q("arr_family_income_dependence", "Arraigo", "¿Tu familia depende de tu ingreso en Ecuador?", OPT.yesNoPlus("Costo de no regresar")),
    q("arr_local_reputation", "Arraigo", "¿Tu actividad profesional es estable y verificable (web/red/contratos)?", OPT.yesNoSmallPlus("Coherencia")),
    q("arr_city_rooted", "Arraigo", "¿Tienes arraigo fuerte en tu ciudad (años viviendo ahí)?", OPT.yesNoSmallPlus("Estabilidad")),
    q("arr_property_mortgage", "Arraigo", "¿Tienes hipoteca al día?", OPT.yesNoSmallPlus("Compromiso")),
    q("arr_business_registration", "Arraigo", "¿Tu negocio está registrado (RUC/permiso municipal)?", OPT.yesNoPlus("Formalidad")),
    q("arr_professional_license", "Arraigo", "¿Tienes licencia/certificación profesional vigente?", OPT.yesNoSmallPlus("Estabilidad")),
    q("arr_local_clients", "Arraigo", "¿Tienes cartera de clientes en Ecuador?", OPT.yesNoSmallPlus("Arraigo")),
    q("arr_invoices", "Arraigo", "¿Emites facturas o tienes ingresos trazables?", OPT.yesNoSmallPlus("Verificabilidad")),
    q("arr_spouse_job", "Arraigo", "¿Tu pareja tiene trabajo estable en Ecuador?", OPT.yesNoSmallPlus("Arraigo familiar")),
    q("arr_children_school_calendar", "Arraigo", "¿Tus hijos tienen calendario escolar que implica retorno?", OPT.yesNoSmallPlus("Retorno")),
    q("arr_home_ownership_family", "Arraigo", "¿Tu familia tiene vivienda estable (propia o arriendo formal)?", OPT.yesNoSmallPlus("Estabilidad")),
    q("arr_multiple_trips_short", "Arraigo", "¿Tus viajes suelen ser cortos y regresas a tiempo?", OPT.yesNoSmallPlus("Cumplimiento")),
    q("arr_community_involvement", "Arraigo", "¿Participas en actividades comunitarias (iglesia, voluntariado, etc.)?", OPT.yesNoSmallPlus("Red social")),
    q("arr_local_insurance", "Arraigo", "¿Tienes seguro/afiliación (IESS/privado) en Ecuador?", OPT.yesNoSmallPlus("Formalidad")),
    q("arr_bank_loans_good", "Arraigo", "¿Tu historial bancario muestra estabilidad (sin retiros raros)?", OPT.yesNoSmallPlus("Coherencia")),
    q("arr_lease_business", "Arraigo", "¿Tu negocio tiene local con contrato vigente?", OPT.yesNoSmallPlus("Arraigo por negocio")),
    q("arr_dependents_support", "Arraigo", "¿Pagas pensiones/alimentos legalmente?", OPT.yesNoPlus("Obligación legal")),
    q("arr_long_term_plan", "Arraigo", "¿Tienes un plan claro a 12 meses en Ecuador (trabajo/estudio/negocio)?", OPT.consistency())
  );

  // =========================
  // EMPLEO (45)
  // =========================
  bank.push(
    q("emp_status", "Empleo", "Situación laboral actual", OPT.employment()),
    q("emp_tenure", "Empleo", "Antigüedad en tu trabajo/negocio actual", OPT.tenure()),
    q("emp_income_proof", "Empleo", "¿Puedes demostrar ingresos (roles/RUC/estados/contratos)?", OPT.incomeProof()),
    q("emp_salary_consistency", "Empleo", "¿Tu ingreso es estable y coherente con tu ocupación?", OPT.consistency()),
    q("emp_contract_type", "Empleo", "Tipo de contrato (si eres empleado)", [
      { value: "na", label: "No aplica", score: 0, why: "Neutral" },
      { value: "indef", label: "Indefinido", score: 7, why: "Estabilidad" },
      { value: "fixed", label: "Plazo fijo", score: 4, why: "Estabilidad moderada" },
      { value: "none", label: "Sin contrato", score: -4, why: "Menos verificable" }
    ]),
    q("emp_role_clarity", "Empleo", "¿Tu rol/ocupación está claramente definido y es verificable?", OPT.yesNoPlus("Coherencia laboral")),
    q("emp_payroll", "Empleo", "¿Recibes rol de pagos o comprobantes mensuales?", OPT.yesNoPlus("Verificabilidad")),
    q("emp_iess", "Empleo", "¿Estás afiliado/a al IESS (si aplica)?", OPT.yesNoSmallPlus("Formalidad")),
    q("emp_business_ruc", "Empleo", "Si tienes negocio, ¿tienes RUC activo?", OPT.yesNoPlus("Formalidad")),
    q("emp_business_age", "Empleo", "Si tienes negocio, ¿cuánto tiempo lleva funcionando?", [
      { value: "na", label: "No aplica", score: 0, why: "Neutral" },
      { value: "lt_1y", label: "< 1 año", score: 2, why: "Arraigo en formación" },
      { value: "1_3y", label: "1–3 años", score: 6, why: "Arraigo moderado" },
      { value: "gt_3y", label: "+3 años", score: 8, why: "Arraigo alto" }
    ]),
    q("emp_business_invoices", "Empleo", "Si tienes negocio, ¿emites facturas regularmente?", OPT.yesNoPlus("Ingresos trazables")),
    q("emp_business_bank", "Empleo", "¿Tu negocio maneja cuenta bancaria separada?", OPT.yesNoSmallPlus("Formalidad")),
    q("emp_promotions", "Empleo", "¿Has tenido crecimiento/ascensos verificables en tu trabajo?", OPT.yesNoSmallPlus("Estabilidad")),
    q("emp_professional_profile", "Empleo", "¿Tienes perfil profesional verificable (LinkedIn, web, portafolio)?", OPT.yesNoSmallPlus("Verificabilidad")),
    q("emp_employer_letter", "Empleo", "¿Podrías obtener carta laboral (si aplica)?", OPT.yesNoSmallPlus("Soporte")),
    q("emp_vacation_approved", "Empleo", "¿Tu viaje coincide con vacaciones/aprobación laboral?", OPT.yesNoPlus("Coherencia")),
    q("emp_return_to_job", "Empleo", "¿Tienes obligación clara de volver a tu trabajo en fecha específica?", OPT.yesNoPlus("Retorno")),
    q("emp_income_level", "Empleo", "Nivel de ingresos mensual (aprox.)", [
      { value: "low", label: "Bajo", score: 0, why: "Depende de presupuesto" },
      { value: "mid", label: "Medio", score: 3, why: "Coherencia posible" },
      { value: "high", label: "Alto", score: 6, why: "Solvencia" }
    ]),
    q("emp_income_jump", "Empleo", "¿Tus ingresos subieron bruscamente en los últimos 3 meses?", [
      { value: "no", label: "No", score: 3, why: "Coherencia" },
      { value: "yes_explained", label: "Sí, con explicación y respaldo", score: 1, why: "Depende" },
      { value: "yes_unclear", label: "Sí, sin respaldo", score: -10, why: "Inconsistencia" }
    ]),
    q("emp_recent_job_change", "Empleo", "¿Cambiaste de trabajo recientemente (<3 meses)?", [
      { value: "no", label: "No", score: 4, why: "Estabilidad" },
      { value: "yes_better", label: "Sí, por mejora y verificable", score: 1, why: "Depende" },
      { value: "yes_unclear", label: "Sí, sin estabilidad", score: -8, why: "Riesgo" }
    ]),
    q("emp_student_status", "Empleo", "Si eres estudiante, ¿puedes demostrar matrícula y continuidad?", OPT.yesNoPlus("Vínculo académico")),
    q("emp_student_break", "Empleo", "Si eres estudiante, ¿tu viaje coincide con vacaciones?", OPT.yesNoSmallPlus("Coherencia")),
    q("emp_income_sources", "Empleo", "¿Tus fuentes de ingreso están claras y documentadas?", OPT.consistency()),
    q("emp_cash_only", "Empleo", "¿Tu ingreso es principalmente en efectivo sin respaldo?", [
      { value: "no", label: "No", score: 3, why: "Mejor trazabilidad" },
      { value: "yes", label: "Sí", score: -6, why: "Menos verificable" }
    ]),
    q("emp_professional_stability", "Empleo", "¿Tu ocupación es consistente en el tiempo (sin cambios frecuentes)?", OPT.yesNoSmallPlus("Coherencia")),
    q("emp_work_schedule", "Empleo", "¿Tu trabajo permite justificar la duración del viaje?", OPT.consistency()),
    q("emp_employment_gap", "Empleo", "¿Tuviste periodos largos sin trabajo en los últimos 2 años?", [
      { value: "no", label: "No", score: 3, why: "Estabilidad" },
      { value: "yes_explained", label: "Sí, explicado", score: 0, why: "Neutral" },
      { value: "yes_unclear", label: "Sí, sin explicación", score: -6, why: "Riesgo" }
    ])
  );

  // =========================
  // FINANZAS (25)
  // =========================
  bank.push(
    q("fin_savings", "Finanzas", "¿Tienes ahorros demostrables para el viaje?", OPT.yesNoPlus("Solvencia")),
    q("fin_bank_statements", "Finanzas", "¿Puedes mostrar estados de cuenta recientes?", OPT.yesNoPlus("Verificabilidad")),
    q("fin_budget_clarity", "Finanzas", "¿Tu presupuesto para el viaje es claro y coherente?", OPT.consistency()),
    q("fin_trip_budget_level", "Finanzas", "Presupuesto aproximado para el viaje", OPT.budget()),
    q("fin_who_pays", "Finanzas", "¿Quién paga el viaje?", OPT.sponsor()),
    q("fin_large_deposit", "Finanzas", "¿Tuviste depósitos grandes recientes sin explicación?", [
      { value: "no", label: "No", score: 3, why: "Coherencia" },
      { value: "yes_explained", label: "Sí, con respaldo", score: 0, why: "Neutral" },
      { value: "yes_unclear", label: "Sí, sin respaldo", score: -10, why: "Inconsistencia" }
    ]),
    q("fin_cash_flow_stable", "Finanzas", "¿Tu flujo mensual es estable?", OPT.yesNoSmallPlus("Coherencia")),
    q("fin_debt_ratio", "Finanzas", "¿Tus deudas son razonables frente a tu ingreso?", [
      { value: "yes", label: "Sí", score: 3, why: "Estabilidad" },
      { value: "some", label: "A veces", score: 0, why: "Neutral" },
      { value: "no", label: "No", score: -6, why: "Riesgo financiero" }
    ]),
    q("fin_card_limits", "Finanzas", "¿Tienes tarjetas o medios de pago para viajes?", OPT.yesNoSmallPlus("Preparación")),
    q("fin_income_vs_trip", "Finanzas", "¿El costo del viaje es coherente con tu ingreso?", OPT.consistency()),
    q("fin_emergency_fund", "Finanzas", "¿Tienes fondo de emergencia adicional?", OPT.yesNoSmallPlus("Solvencia")),
    q("fin_booking_evidence", "Finanzas", "¿Puedes demostrar reservas o intención de reservas (itinerario)?", OPT.yesNoSmallPlus("Coherencia")),
    q("fin_tax_returns", "Finanzas", "¿Puedes demostrar declaración/impuestos (si aplica)?", OPT.yesNoSmallPlus("Formalidad")),
    q("fin_sponsor_docs", "Finanzas", "Si alguien te apoya, ¿puedes demostrar su capacidad financiera?", OPT.yesNoSmallPlus("Coherencia"))
  );

  // =========================
  // VIAJES (35)
  // =========================
  bank.push(
    q("travel_count_total", "Viajes", "¿Cuántos viajes internacionales has hecho?", OPT.travelCount()),
    q("travel_return_on_time", "Viajes", "¿Siempre regresaste a tiempo en viajes anteriores?", OPT.yesNoPlus("Cumplimiento")),
    q("travel_overstay", "Viajes", "¿Alguna vez te quedaste más tiempo del permitido en otro país?", OPT.yesNoRisk("Sobreestadía previa")),
    q("travel_denial_any", "Viajes", "¿Te negaron una visa antes?", OPT.visaDenial()),
    q("travel_prev_us_visa", "Viajes", "¿Tuviste visa americana anteriormente?", OPT.yesNoSmallPlus("Historial")),
    q("travel_used_us_visa_correctly", "Viajes", "Si tuviste visa, ¿la usaste correctamente y regresaste a tiempo?", OPT.yesNoPlus("Cumplimiento")),
    q("travel_schengen_history", "Viajes", "¿Has viajado a zona Schengen/UK/Canadá y regresaste a tiempo?", OPT.yesNoPlus("Historial fuerte")),
    q("travel_travel_pattern_short", "Viajes", "¿Tus viajes suelen ser cortos y coherentes?", OPT.yesNoSmallPlus("Coherencia")),
    q("travel_passport_stamps", "Viajes", "¿Tienes pasaportes anteriores con sellos que respalden viajes?", OPT.yesNoSmallPlus("Evidencia")),
    q("travel_travel_purpose_consistent", "Viajes", "¿El motivo de viaje actual es consistente con tus viajes previos?", OPT.consistency()),
    q("travel_recent_trips", "Viajes", "¿Viajaste internacionalmente en los últimos 12 meses?", OPT.yesNoSmallPlus("Historial reciente")),
    q("travel_first_time", "Viajes", "¿Este sería tu primer viaje internacional?", [
      { value: "no", label: "No", score: 3, why: "Historial previo" },
      { value: "yes", label: "Sí", score: 0, why: "Neutral" }
    ]),
    q("travel_transit_issues", "Viajes", "¿Has tenido problemas migratorios en aeropuertos (rechazo/retención)?", OPT.yesNoRisk("Incidente migratorio")),
    q("travel_document_loss", "Viajes", "¿Has perdido pasaporte/visa en el pasado?", [
      { value: "no", label: "No", score: 2, why: "Neutral" },
      { value: "yes_reported", label: "Sí, y lo reporté", score: 0, why: "Neutral" },
      { value: "yes_unclear", label: "Sí, sin respaldo", score: -6, why: "Riesgo" }
    ]),
    q("travel_travel_companions_history", "Viajes", "¿Tu acompañante (si aplica) tiene historial de viajes ordenado?", OPT.yesNoSmallPlus("Coherencia"))
  );

  // =========================
  // EEUU (35)
  // =========================
  bank.push(
    q("us_illegal_presence", "EEUU", "¿Has estado en EE.UU. de forma irregular alguna vez?", OPT.yesNoCritical("Presencia irregular previa")),
    q("us_family_direct", "EEUU", "¿Tienes familia directa viviendo en EE.UU.?", [
      { value: "no", label: "No", score: 2, why: "Neutral/positivo" },
      { value: "yes", label: "Sí", score: -10, why: "Puede aumentar incentivo migratorio" }
    ]),
    q("us_family_distant", "EEUU", "¿Tienes familia lejana (tíos/primos) en EE.UU.?", [
      { value: "no", label: "No", score: 1, why: "Neutral" },
      { value: "yes", label: "Sí", score: 0, why: "Neutral" }
    ]),
    q("us_invitation", "EEUU", "¿Tienes invitación clara para un evento específico?", OPT.yesNoSmallPlus("Motivo concreto")),
    q("us_stay_with_family", "EEUU", "¿Planeas quedarte en casa de familiares/amigos?", [
      { value: "hotel", label: "Hotel/Airbnb", score: 3, why: "Plan claro" },
      { value: "family", label: "Casa de familiar/amigo", score: 1, why: "Depende de coherencia" },
      { value: "unclear", label: "No sé", score: -6, why: "Plan débil" }
    ]),
    q("us_purpose_tourism", "EEUU", "Motivo principal del viaje", [
      { value: "tourism", label: "Turismo", score: 5, why: "Común" },
      { value: "business", label: "Negocios", score: 4, why: "Común si es coherente" },
      { value: "visit_family", label: "Visitar familia", score: 2, why: "Depende de arraigo" },
      { value: "medical", label: "Tratamiento médico", score: 3, why: "Debe estar documentado" }
    ]),
    q("us_intent_work_study", "EEUU", "¿Planeas trabajar o estudiar en EE.UU. con B1/B2?", OPT.usIntent()),
    q("us_multiple_cities", "EEUU", "¿Tu itinerario contempla ciudades razonables (no excesivo)?", OPT.consistency()),
    q("us_duration", "EEUU", "Duración estimada del viaje", OPT.tripDuration()),
    q("us_return_plan", "EEUU", "Plan de regreso", OPT.returnPlan()),
    q("us_previous_contacts", "EEUU", "¿Has tenido trámites previos con EE.UU. (visas/CBP) sin problemas?", OPT.yesNoSmallPlus("Historial")),
    q("us_reason_now", "EEUU", "¿Puedes explicar claramente por qué viajas ahora?", OPT.consistency()),
    q("us_trip_paid_before", "EEUU", "¿Ya pagaste reservas (parcial) o puedes demostrar intención real de viaje?", OPT.yesNoSmallPlus("Coherencia"))
  );

  // =========================
  // COHERENCIA (40)
  // =========================
  bank.push(
    q("coh_itinerary_ready", "Coherencia", "¿Tienes itinerario detallado (lugares, fechas, actividades)?", OPT.yesNoPlus("Coherencia")),
    q("coh_budget_matches_itinerary", "Coherencia", "¿El itinerario coincide con tu presupuesto?", OPT.consistency()),
    q("coh_hotel_or_stay_defined", "Coherencia", "¿Tienes definido dónde te hospedarás?", OPT.consistency()),
    q("coh_ticket_roundtrip", "Coherencia", "¿Planeas comprar pasaje ida y vuelta?", OPT.yesNoPlus("Coherencia de retorno")),
    q("coh_duration_vs_job", "Coherencia", "¿La duración del viaje es compatible con tu trabajo/estudio?", OPT.consistency()),
    q("coh_story_simple", "Coherencia", "¿Tu historia es simple y consistente (sin contradicciones)?", OPT.consistency()),
    q("coh_previous_denial_explain", "Coherencia", "Si tuviste negación previa, ¿puedes explicarla sin contradicciones?", [
      { value: "na", label: "No aplica", score: 0, why: "Neutral" },
      { value: "yes", label: "Sí", score: 2, why: "Depende" },
      { value: "no", label: "No", score: -8, why: "Inconsistencia" }
    ]),
    q("coh_financial_docs_ready", "Coherencia", "¿Tienes documentos listos para sustentar ingresos y arraigo?", OPT.yesNoPlus("Preparación")),
    q("coh_dates_specific", "Coherencia", "¿Tienes fechas exactas o aproximadas bien definidas?", OPT.yesNoSmallPlus("Coherencia")),
    q("coh_answers_consistent", "Coherencia", "¿Tus respuestas son consistentes con lo que mostrarían tus documentos?", OPT.consistency()),
    q("coh_previous_travel_consistency", "Coherencia", "¿Tu patrón de viajes previos coincide con tu situación actual?", OPT.consistency()),
    q("coh_sponsor_consistency", "Coherencia", "Si hay patrocinio, ¿es coherente con tu relación y la evidencia?", OPT.consistency()),
    q("coh_job_letter_alignment", "Coherencia", "¿Lo que diría tu empleador coincide con tu viaje (vacaciones/permiso)?", OPT.consistency()),
    q("coh_student_calendar_alignment", "Coherencia", "Si estudias, ¿tu viaje coincide con vacaciones oficiales?", OPT.consistency()),
    q("coh_return_obligation", "Coherencia", "¿Tienes una razón clara que te obliga a regresar?", OPT.returnPlan()),
    q("coh_clarity_why_visit", "Coherencia", "¿Puedes explicar el motivo del viaje en 1 frase clara?", OPT.consistency()),
    q("coh_travel_companion_logic", "Coherencia", "Si viajas con alguien, ¿tiene sentido y es coherente?", OPT.consistency()),
    q("coh_plans_after_return", "Coherencia", "¿Qué harás al regresar a Ecuador?", OPT.consistency())
  );

  // Total aproximado: 20 + 45 + 45 + 25 + 35 + 35 + 40 = 245
  // (Tener 200+ es mejor: el random siempre tendrá variedad)
  return bank;
}

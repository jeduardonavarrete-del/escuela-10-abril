import { Target, Eye, BookOpen, Award, Phone, MapPin, Clock, User } from 'lucide-react'

const CARDS = [
  {
    icon: BookOpen,
    title: 'Historia',
    color: 'bg-green-50 text-green-700 border-green-200',
    iconBg: 'bg-green-100',
    content:
      'Fundada para brindar educación secundaria de calidad a la comunidad de Emiliano Zapata, nuestra escuela lleva décadas formando generaciones comprometidas con el progreso de Morelos.',
  },
  {
    icon: Target,
    title: 'Misión',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    iconBg: 'bg-blue-100',
    content:
      'Ofrecer educación secundaria de calidad que desarrolle en los alumnos habilidades cognitivas, sociales y éticas, fomentando su participación activa como ciudadanos responsables.',
  },
  {
    icon: Eye,
    title: 'Visión',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    iconBg: 'bg-purple-100',
    content:
      'Ser una escuela reconocida por su excelencia académica y formación integral, donde cada estudiante alcanza su máximo potencial y contribuye positivamente a su comunidad.',
  },
  {
    icon: Award,
    title: 'Valores',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    iconBg: 'bg-yellow-100',
    content:
      'Respeto, responsabilidad, honestidad, solidaridad y esfuerzo son los pilares que guían la convivencia y el aprendizaje en nuestra comunidad escolar.',
  },
]

export default function InfoSection() {
  return (
    <section id="informacion" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-green-100 text-green-800 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Nuestra Escuela
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Conócenos
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
            Más de una generación de estudiantes morelenses han encontrado en el "10 de Abril" su segundo hogar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CARDS.map(card => (
            <div
              key={card.title}
              className={`border rounded-2xl p-6 flex flex-col gap-4 ${card.color} transition-transform hover:-translate-y-1`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">{card.title}</h3>
              <p className="text-sm leading-relaxed opacity-80">{card.content}</p>
            </div>
          ))}
        </div>

        {/* Datos de contacto y director */}
        <div className="mt-14 bg-green-900 rounded-3xl p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-white">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-green-300" />
            </div>
            <div>
              <p className="text-green-300 text-xs font-semibold uppercase tracking-wide mb-0.5">Director</p>
              <p className="font-semibold text-sm leading-snug">Mtro. Mario Edgary Vázquez López</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-green-300" />
            </div>
            <div>
              <p className="text-green-300 text-xs font-semibold uppercase tracking-wide mb-0.5">Teléfono</p>
              <p className="font-semibold text-sm">(777) 368-0092</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-green-300" />
            </div>
            <div>
              <p className="text-green-300 text-xs font-semibold uppercase tracking-wide mb-0.5">Horario</p>
              <p className="font-semibold text-sm">Turno Matutino</p>
              <p className="text-green-200 text-xs">7:00 – 13:10 hrs</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-green-300" />
            </div>
            <div>
              <p className="text-green-300 text-xs font-semibold uppercase tracking-wide mb-0.5">Dirección</p>
              <p className="font-semibold text-sm leading-snug">Av. Temixco y No Reelección #1, Col. Centro, Emiliano Zapata, Morelos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

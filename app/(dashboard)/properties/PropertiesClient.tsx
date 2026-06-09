'use client'
import { useState } from 'react'
import { useLang } from '@/lib/lang-context'
import { createClient } from '@/lib/supabase'
import { Plus, Building2, Home, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Property } from '@/types'

export function PropertiesClient({ properties: initial }: { properties: Property[] }) {
  const { tr, lang } = useLang()
  const [properties, setProperties] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', civic_number: '', street: '', city: 'Longueuil', postal_code: '', notes: '' })
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('properties').insert({ ...form, user_id: user!.id, building_type: 'plex' }).select('*, units(*)').single()
    if (error) return toast.error(tr.common.error)
    setProperties([data, ...properties])
    setShowForm(false)
    setForm({ name: '', civic_number: '', street: '', city: 'Longueuil', postal_code: '', notes: '' })
    toast.success(lang === 'fr' ? 'Propriété ajoutée' : 'Property added')
  }

  const handleDelete = async (id: string) => {
    if (!confirm(lang === 'fr' ? 'Supprimer cette propriété?' : 'Delete this property?')) return
    const { error } = await supabase.from('properties').delete().eq('id', id)
    if (error) return toast.error(tr.common.error)
    setProperties(properties.filter(p => p.id !== id))
    toast.success(lang === 'fr' ? 'Propriété supprimée' : 'Property deleted')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{tr.properties.title}</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> {tr.properties.addProperty}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-base font-semibold text-white mb-4">{tr.properties.addProperty}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">{lang === 'fr' ? 'Nom de la propriété' : 'Property name'}</label>
              <input className="input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={lang === 'fr' ? 'ex: Duplex St-Hubert' : 'e.g. St-Hubert Duplex'} />
            </div>
            <div>
              <label className="label">{lang === 'fr' ? 'Numéro civique' : 'Civic number'}</label>
              <input className="input" required value={form.civic_number} onChange={e => setForm({...form, civic_number: e.target.value})} />
            </div>
            <div>
              <label className="label">{lang === 'fr' ? 'Rue' : 'Street'}</label>
              <input className="input" required value={form.street} onChange={e => setForm({...form, street: e.target.value})} />
            </div>
            <div>
              <label className="label">{lang === 'fr' ? 'Ville' : 'City'}</label>
              <input className="input" required value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
            </div>
            <div>
              <label className="label">{lang === 'fr' ? 'Code postal' : 'Postal code'}</label>
              <input className="input" value={form.postal_code} onChange={e => setForm({...form, postal_code: e.target.value})} />
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">{tr.common.cancel}</button>
              <button type="submit" className="btn-primary">{tr.common.save}</button>
            </div>
          </form>
        </div>
      )}

      {properties.length === 0 ? (
        <div className="card text-center py-16">
          <Building2 size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">{tr.properties.noProperties}</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-4 mx-auto">{tr.properties.addProperty}</button>
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map(p => (
            <div key={p.id} className="card">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-teal-500/10 rounded-lg flex items-center justify-center">
                    <Building2 size={16} className="text-teal-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.civic_number} {p.street}, {p.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge-slate">{p.units?.length ?? 0} {(p.units?.length ?? 0) === 1 ? tr.properties.unit : tr.properties.units}</span>
                  <button onClick={e => { e.stopPropagation(); handleDelete(p.id) }} className="text-slate-500 hover:text-red-400 transition-colors">
                    <Trash2 size={15} />
                  </button>
                  {expanded === p.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </div>
              </div>

              {expanded === p.id && (
                <div className="mt-4 pt-4 border-t border-navy-700">
                  <AddUnitSection propertyId={p.id} units={p.units ?? []} lang={lang} tr={tr} onAdd={(unit) => {
                    setProperties(properties.map(prop => prop.id === p.id ? { ...prop, units: [...(prop.units ?? []), unit] } : prop))
                  }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AddUnitSection({ propertyId, units, lang, tr, onAdd }: any) {
  const [showUnitForm, setShowUnitForm] = useState(false)
  const [unitForm, setUnitForm] = useState({ unit_number: '', bedrooms: 2, is_heated: true })
  const supabase = createClient()

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase.from('units').insert({ ...unitForm, property_id: propertyId, is_furnished: false }).select().single()
    if (error) return toast.error(tr.common.error)
    onAdd(data)
    setShowUnitForm(false)
    setUnitForm({ unit_number: '', bedrooms: 2, is_heated: true })
    toast.success(lang === 'fr' ? 'Logement ajouté' : 'Unit added')
  }

  return (
    <div className="space-y-3">
      {units.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {units.map((u: any) => {
            const activeLease = u.leases?.find((l: any) => l.is_active)
            const tenant = activeLease?.tenant
            return (
              <div key={u.id} className="flex items-center gap-3 bg-navy-700 rounded-lg px-3 py-2.5">
                <Home size={14} className="text-slate-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{lang === 'fr' ? 'Unité' : 'Unit'} {u.unit_number}</p>
                  {tenant ? (
                    <p className="text-xs text-slate-400 truncate">{tenant.first_name} {tenant.last_name} · ${activeLease.current_rent}/mois</p>
                  ) : (
                    <p className="text-xs text-slate-500">{lang === 'fr' ? 'Vacant' : 'Vacant'}</p>
                  )}
                </div>
                {u.is_heated && <span className="badge-slate text-xs">{lang === 'fr' ? 'Chauffé' : 'Heated'}</span>}
              </div>
            )
          })}
        </div>
      )}

      {showUnitForm ? (
        <form onSubmit={handleAddUnit} className="bg-navy-700 rounded-lg p-3 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label text-xs">{lang === 'fr' ? 'Numéro' : 'Number'}</label>
              <input className="input" required value={unitForm.unit_number} onChange={e => setUnitForm({...unitForm, unit_number: e.target.value})} placeholder="101" />
            </div>
            <div>
              <label className="label text-xs">{lang === 'fr' ? 'Chambres' : 'Bedrooms'}</label>
              <input type="number" min="0" max="10" className="input" value={unitForm.bedrooms} onChange={e => setUnitForm({...unitForm, bedrooms: parseInt(e.target.value)})} />
            </div>
            <div className="flex items-end pb-2.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={unitForm.is_heated} onChange={e => setUnitForm({...unitForm, is_heated: e.target.checked})} className="w-4 h-4 accent-teal-500" />
                <span className="text-sm text-slate-300">{lang === 'fr' ? 'Chauffé' : 'Heated'}</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowUnitForm(false)} className="btn-ghost text-xs">{tr.common.cancel}</button>
            <button type="submit" className="btn-primary text-xs">{tr.common.save}</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowUnitForm(true)} className="btn-ghost text-xs flex items-center gap-1.5">
          <Plus size={13} /> {lang === 'fr' ? 'Ajouter un logement' : 'Add a unit'}
        </button>
      )}
    </div>
  )
}

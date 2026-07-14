import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { z } from 'zod';
import { api } from '../../lib/api';
import { isQRTokenValid, readQRToken, secondsRemaining } from '../../lib/qrToken';
import { DutyOfficerNotice } from './DutyOfficerNotice';
import { FieldShell, FormHero, FormSection } from './FormParts';

const schema = z.object({
  bodyNumber: z.string().min(2, 'No. badan is required'),
  rank: z.string().min(2, 'Pangkat is required'),
  name: z.string().min(2, 'Name is required'),
  peringkat: z.string().min(1, 'Peringkat is required'),
  phone: z.string().min(6, 'Phone number is required'),
  symptoms: z.string().min(1, 'Select symptoms'),
  description: z.string().min(5, 'Describe your condition'),
  locationType: z.enum(['Duty Officer Room', 'Own Room']),
  building: z.string().optional(),
  room: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.locationType === 'Own Room' && (!data.building || !data.room)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['room'], message: 'Building and room are required' });
  }
});

type FormData = z.infer<typeof schema>;

export function SickCheckInForm() {
  const [submitted, setSubmitted] = useState(false);
  const location = useLocation();
  const qrState = readQRToken(location.search);
  const params = new URLSearchParams(location.search);
  const dutyPayload = {
    dutyOfficerName: params.get('duty_officer_name') ?? undefined,
    dutyOfficerId: params.get('duty_officer_id') ?? undefined,
    dutyStartedAt: params.get('duty_started_at') ?? undefined,
    dutyEndedAt: params.get('duty_ended_at') ?? undefined
  };
  const submitReport = useMutation({ mutationFn: api.createPublicSickReport, onSuccess: () => setSubmitted(true) });
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { locationType: 'Duty Officer Room' }
  });
  const ownRoom = watch('locationType') === 'Own Room';

  if (!isQRTokenValid(qrState)) {
    return <section className="card space-y-3 text-center"><h2 className="text-xl font-bold">QR Expired</h2><p className="text-sm text-slate-500">Please scan the latest QR shown by the Duty Officer.</p></section>;
  }

  if (submitted) {
    return <section className="card space-y-2 text-center"><h2 className="text-xl font-bold">Sick Report Checked In</h2><p className="text-sm text-slate-500">Duty Officer has received your sick report.</p></section>;
  }

  return (
    <form className="space-y-4 pb-4" onSubmit={handleSubmit((data) => submitReport.mutate({ ...data, ...dutyPayload, qrToken: qrState?.token }))}>
      <FormHero title="Lapor DO Sakit" description="Fill in your personal and sick report details." remaining={secondsRemaining(qrState!.expiresAt)} />
      <DutyOfficerNotice
        name={dutyPayload.dutyOfficerName}
        id={dutyPayload.dutyOfficerId}
        startedAt={dutyPayload.dutyStartedAt}
        endedAt={dutyPayload.dutyEndedAt}
      />
      <FormSection title="Cadet Details" description="Use your official ROTU/PALAPES details.">
        <FieldShell label="No. Badan" error={errors.bodyNumber?.message}><input className="field" placeholder="Example: 7546001" {...register('bodyNumber')} /></FieldShell>
        <div className="grid grid-cols-2 gap-3">
          <FieldShell label="Pangkat" error={errors.rank?.message}><input className="field" placeholder="CDT" {...register('rank')} /></FieldShell>
          <FieldShell label="Phone" error={errors.phone?.message}><input className="field" inputMode="tel" placeholder="01X-XXXXXXX" {...register('phone')} /></FieldShell>
        </div>
        <FieldShell label="Nama" error={errors.name?.message}><input className="field" placeholder="Full name" {...register('name')} /></FieldShell>
        <FieldShell label="Peringkat" error={errors.peringkat?.message}><select className="field" {...register('peringkat')}><option value="">Select peringkat</option><option>Junior</option><option>Intermediate</option><option>Senior</option></select></FieldShell>
      </FormSection>
      <FormSection title="Sick Details" description="Tell the Duty Officer your condition and rest location.">
        <FieldShell label="Symptoms" error={errors.symptoms?.message}><select className="field" {...register('symptoms')}><option value="">Select symptoms</option><option>Fever</option><option>Headache</option><option>Stomach Pain</option><option>Injury</option><option>Others</option></select></FieldShell>
        <FieldShell label="Description" error={errors.description?.message}><textarea className="field min-h-28 resize-none" placeholder="Briefly describe your condition" {...register('description')} /></FieldShell>
        <FieldShell label="Rest Location"><select className="field" {...register('locationType')}><option>Duty Officer Room</option><option>Own Room</option></select></FieldShell>
        {ownRoom && <div className="grid grid-cols-2 gap-3"><FieldShell label="Building"><input className="field" {...register('building')} /></FieldShell><FieldShell label="Room" error={errors.room?.message}><input className="field" {...register('room')} /></FieldShell></div>}
      </FormSection>
      {submitReport.isError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">Unable to submit. Make sure the backend server is running on the DO laptop.</p>}
      <button className="btn-danger w-full" disabled={submitReport.isPending}>{submitReport.isPending ? 'Submitting...' : 'Check In Sick Report'}</button>
    </form>
  );
}

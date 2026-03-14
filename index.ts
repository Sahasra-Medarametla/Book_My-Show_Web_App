import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date().toISOString().split('T')[0];

    // Update movies with past release dates to 'ended' if they've been showing for 60+ days
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const { data: endedMovies, error: endError } = await supabase
      .from('movies')
      .update({ availability: 'ended' })
      .lt('release_date', sixtyDaysAgo.toISOString().split('T')[0])
      .eq('availability', 'now_showing')
      .select();

    // Update coming soon movies to now showing if release date has passed
    const { data: nowShowingMovies, error: showError } = await supabase
      .from('movies')
      .update({ availability: 'now_showing' })
      .lte('release_date', today)
      .eq('availability', 'coming_soon')
      .select();

    console.log(`Updated ${endedMovies?.length || 0} movies to ended, ${nowShowingMovies?.length || 0} to now_showing`);

    return new Response(
      JSON.stringify({
        success: true,
        ended: endedMovies?.length || 0,
        nowShowing: nowShowingMovies?.length || 0,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error updating movie availability:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});


import { supabase } from "@/integrations/supabase/client";

/**
 * Saves a screenshot to Supabase storage
 */
export const saveScreenshot = async (
  screenshot: string,
  sessionId: string
): Promise<string | undefined> => {
  try {
    // Extract base64 data
    const base64Data = screenshot.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Upload to supabase storage
    const { data: uploadData, error } = await supabase.storage
      .from('screenshots')
      .upload(`${sessionId}/${Date.now()}.jpg`, buffer, {
        contentType: 'image/jpeg',
        upsert: true
      });
      
    if (!error && uploadData) {
      return uploadData.path;
    }
    
    return undefined;
  } catch (error) {
    console.error("Error saving screenshot:", error);
    return undefined;
  }
};

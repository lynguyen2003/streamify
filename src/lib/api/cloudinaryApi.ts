

// Delete a file from Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/upload/${publicId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
} 
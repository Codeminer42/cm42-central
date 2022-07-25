class TagGroupsController < ApplicationController
  skip_after_action :verify_policy_scoped, only: :index

  def index
    @tag_groups = current_team.tag_groups
    authorize @tag_groups
  end

  def new
    @tag_group = TagGroup.new
    authorize @tag_group
  end

  def edit
    @tag_group = current_team.tag_groups.find(params[:id])
    authorize @tag_group
  end

  def update
    @tag_group = current_team.tag_groups.find(params[:id])
    authorize @tag_group

    @tag_group.update(allowed_params)

    redirect_to tag_groups_path
  end

  def create
    @tag_group = current_team.tag_groups.new(allowed_params)
    authorize @tag_group

    respond_to do |format|
      if @tag_group.save
        format.html { redirect_to tag_groups_path }
        format.js   { render action: 'show' }
      else
        format.html do
          redirect_to(
            new_tag_group_path,
            flash: { error: @tag_group.errors.full_messages.to_sentence }
          )
        end

        format.json { render json: @tag_group.errors, status: :unprocessable_entity }

        format.js do
          render(
            json: @tag_group.errors,
            status: :unprocessable_entity,
            content_type: 'application/json'
          )
        end
      end
    end
  end

  def destroy
    @tag_group = current_team.tag_groups.find(params[:id])
    authorize @tag_group
    @tag_group.destroy
    redirect_to tag_groups_path
  end

  def allowed_params
    params.require(:tag_group).permit(:name, :description, :bg_color)
  end
end
